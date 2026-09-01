/**
 * INTEGRAÇÃO FIREBASE REALTIME DATABASE
 * Crea-Jr Núcleo Itajubá — Free Time & Agendamento de Reuniões
 *
 * Responsável por sincronização em tempo real de membros e horários livres
 * entre todos os dispositivos sem necessidade de commit no GitHub.
 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCJXfcZbje7ueiEmmqm6f4aQS7ESVDpX3E",
    authDomain: "bancodedadoscreajr.firebaseapp.com",
    databaseURL: "https://bancodedadoscreajr-default-rtdb.firebaseio.com",
    projectId: "bancodedadoscreajr",
    storageBucket: "bancodedadoscreajr.firebasestorage.app",
    messagingSenderId: "908891795992",
    appId: "1:908891795992:web:d9ac539695327e699a496d",
    measurementId: "G-DSDV8T25M9"
};

// Referência global do banco
let _db = null;
let _membersRef = null;
let _firebaseReady = false;

/**
 * Inicializa o Firebase. Chamado uma vez ao carregar a página.
 */
function fbSetup() {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        _db = firebase.database();
        _membersRef = _db.ref('members');
        _firebaseReady = true;
        console.log('[Firebase] ✅ Conectado ao Realtime Database.');
    } catch (err) {
        console.error('[Firebase] ❌ Erro ao inicializar:', err);
        _firebaseReady = false;
    }
}

/**
 * Verifica se Firebase está disponível.
 */
function fbIsReady() {
    return _firebaseReady && !!_membersRef;
}

/**
 * Inicializa o listener em tempo real.
 * Quando qualquer dado mudar no Firebase, chama onUpdate(members[]).
 * @param {function} onUpdate - Callback com array de membros atualizado
 */
function fbListen(onUpdate) {
    if (!fbIsReady()) {
        console.warn('[Firebase] Não disponível. Usando localStorage.');
        return;
    }

    _membersRef.on('value', (snapshot) => {
        try {
            const data = snapshot.val();
            if (data && typeof data === 'object') {
                const members = Object.values(data)
                    .filter(m => m && m.id && m.name);
                if (members.length > 0) {
                    onUpdate(members);
                    return;
                }
            }
            // Banco vazio: popula com os membros iniciais do data.js
            console.log('[Firebase] Banco vazio. Carregando membros iniciais do data.js...');
            _fbWriteAllMembers(INITIAL_MEMBERS)
                .then(() => onUpdate(JSON.parse(JSON.stringify(INITIAL_MEMBERS))))
                .catch(err => console.error('[Firebase] Erro ao popular banco:', err));
        } catch (err) {
            console.error('[Firebase] Erro no listener:', err);
        }
    }, (err) => {
        console.error('[Firebase] Erro de permissão/conexão:', err);
    });
}

/**
 * Salva UM membro completo (para add/edit via admin).
 */
function fbSaveMember(member) {
    if (!fbIsReady() || !member || !member.id) return Promise.resolve();
    return _membersRef.child(member.id).set(member);
}

/**
 * Salva apenas os freeSlots de um membro (eficiente para pintura da grade).
 * Envia somente os slots alterados, não todos os dados do membro.
 */
function fbSaveMemberSlots(memberId, slots) {
    if (!fbIsReady() || !memberId) return Promise.resolve();
    return _membersRef.child(memberId).child('freeSlots').set(slots || []);
}

/**
 * Remove um membro do Firebase (admin delete).
 */
function fbDeleteMember(memberId) {
    if (!fbIsReady() || !memberId) return Promise.resolve();
    return _membersRef.child(memberId).remove();
}

/**
 * Escreve todos os membros de uma só vez (uso interno / reset).
 * @private
 */
function _fbWriteAllMembers(members) {
    if (!fbIsReady()) return Promise.resolve();
    const obj = {};
    members.forEach(m => { if (m && m.id) obj[m.id] = m; });
    return _membersRef.set(obj);
}

/**
 * Exporta todos os membros do Firebase para download como data.js
 * (chamado pelo botão no modal admin)
 */
function fbExportDataJs() {
    if (!fbIsReady()) {
        alert('Firebase não disponível. Verifique a conexão com a internet.');
        return;
    }

    _membersRef.once('value').then(snapshot => {
        const data = snapshot.val();
        if (!data) {
            alert('Nenhum dado encontrado no Firebase.');
            return;
        }

        const members = Object.values(data).filter(m => m && m.id && m.name);

        const membersJs = members.map(m => {
            const slots = m.freeSlots ? JSON.stringify(m.freeSlots) : '[]';
            const photo = (m.photo || '').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
            const name  = (m.name  || '').replace(/`/g, '\\`');
            const role  = (m.role  || '').replace(/`/g, '\\`');
            return `    {
        id: '${m.id}',
        name: \`${name}\`,
        role: \`${role}\`,
        department: '${m.department || 'geral'}',
        photo: \`${photo}\`,
        email: '',
        phone: '',
        freeSlots: ${slots}
    }`;
        }).join(',\n');

        fetch('data.js')
            .then(r => r.text())
            .then(original => {
                const startMarker = '// Membros';
                const storageMarker = '// Gerenciador do Storage';
                const idx = original.indexOf(startMarker);
                const storageIdx = original.indexOf(storageMarker);
                const header = idx !== -1 ? original.substring(0, idx) : '';
                const footer = storageIdx !== -1 ? original.substring(storageIdx) : '';

                const newContent = header +
                    `// Membros atuais do Crea-Jr Núcleo Itajubá\nconst INITIAL_MEMBERS = [\n${membersJs}\n];\n\n` +
                    footer;

                const blob = new Blob([newContent], { type: 'text/javascript;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'data.js';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                if (typeof showToast === 'function') showToast('✅ data.js exportado com dados do Firebase!');
            })
            .catch(() => {
                // Fallback: baixa apenas os membros como JSON
                const blob = new Blob([JSON.stringify({ members }, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `membros_creajr_${new Date().toISOString().slice(0,10)}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                if (typeof showToast === 'function') showToast('✅ Membros exportados como JSON (abra via servidor para data.js).');
            });
    });
}
