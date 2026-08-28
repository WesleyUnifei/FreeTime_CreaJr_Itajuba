/**
 * Base de dados padrão do Free Time - Crea-Jr Núcleo Itajubá
 * Padrão de Horários Oficiais UNIFEI (M1-M6, T1-T6, N1-N4)
 */

const DAYS = [
    { id: 'seg', name: 'Segunda-feira', short: 'Seg' },
    { id: 'ter', name: 'Terça-feira', short: 'Ter' },
    { id: 'qua', name: 'Quarta-feira', short: 'Qua' },
    { id: 'qui', name: 'Quinta-feira', short: 'Qui' },
    { id: 'sex', name: 'Sexta-feira', short: 'Sex' },
    { id: 'sab', name: 'Sábado', short: 'Sáb' }
];

const PERIODS = [
    {
        id: 'manha',
        name: 'Manhã',
        color: '#0033A0',
        slots: [
            { id: 'M1', label: 'M1', time: '07:00 - 07:55' },
            { id: 'M2', label: 'M2', time: '07:55 - 08:50' },
            { id: 'M3', label: 'M3', time: '08:55 - 09:45' },
            { id: 'M4', label: 'M4', time: '10:10 - 11:05' },
            { id: 'M5', label: 'M5', time: '11:05 - 12:00' }
        ]
    },
    {
        id: 'tarde',
        name: 'Tarde',
        color: '#0077B5',
        slots: [
            { id: 'T1', label: 'T1', time: '13:30 - 14:25' },
            { id: 'T2', label: 'T2', time: '14:25 - 15:20' },
            { id: 'T3', label: 'T3', time: '15:45 - 16:40' },
            { id: 'T4', label: 'T4', time: '16:40 - 17:35' },
            { id: 'T5', label: 'T5', time: '17:35 - 18:30' }
        ]
    },
    {
        id: 'noite',
        name: 'Noite',
        color: '#00226C',
        slots: [
            { id: 'N1', label: 'N1', time: '19:00 - 19:50' },
            { id: 'N2', label: 'N2', time: '19:50 - 20:40' },
            { id: 'N3', label: 'N3', time: '21:00 - 21:50' },
            { id: 'N4', label: 'N4', time: '21:50 - 22:40' },
            { id: 'N5', label: 'N5', time: '22:40 - 23:30' }
        ]
    }
];

// Lista de todos os slots para facilitar iteração
const ALL_SLOTS = PERIODS.flatMap(period => 
    period.slots.map(s => ({ ...s, period: period.id, periodName: period.name }))
);

// Diretorias do Crea-Jr Núcleo Itajubá com cores temáticas
const DEPARTMENTS = [
    { id: 'geral', name: 'Coordenação Geral', color: '#0033A0', bgLight: '#e6f0ff' },
    { id: 'financeiro', name: 'Financeiro', color: '#0077B5', bgLight: '#e0f2f7' },
    { id: 'marketing', name: 'Comunicação e Marketing', color: '#4A90E2', bgLight: '#eef6ff' },
    { id: 'projetos', name: 'Projetos e Eventos', color: '#005A9C', bgLight: '#e8f4fc' },
    { id: 'qualidade', name: 'Gestão da Qualidade', color: '#2E58A6', bgLight: '#edf3fc' },
    { id: 'ti', name: 'Tecnologia da Informação', color: '#004B8D', bgLight: '#e6f2fb' },
    { id: 'documentos', name: 'Documentos', color: '#3E82C3', bgLight: '#ebf4fc' },
    { id: 'pessoas', name: 'Gestão de Pessoas', color: '#1B4D89', bgLight: '#e7f0fa' }
];

// Helper para gerar horários simulados realistas para cada membro
function generateSampleSlots(seed) {
    const slots = [];
    const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    
    days.forEach((day, dayIndex) => {
        if ((seed + dayIndex) % 2 === 0) {
            slots.push(`${day}_T3`, `${day}_T4`);
        }
        if ((seed + dayIndex) % 3 === 0) {
            slots.push(`${day}_T4`, `${day}_T5`);
        }
        if ((seed * 2 + dayIndex) % 4 === 0) {
            slots.push(`${day}_M4`, `${day}_M5`);
        }
        if ((seed + dayIndex) % 5 === 0) {
            slots.push(`${day}_N1`, `${day}_N2`);
        }
    });

    slots.push('ter_T3', 'ter_T4', 'qui_T3', 'qui_T4');
    return Array.from(new Set(slots));
}

// Membros reais do Crea-Jr Núcleo Itajubá
const INITIAL_MEMBERS = [
    // Coordenação Geral
    {
        id: 'victor-de-faria',
        name: 'Victor de Faria',
        role: 'Coordenador Geral',
        department: 'geral',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/victor%20de%20faria.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(1)
    },
    {
        id: 'guilherme-rodrigues',
        name: 'Guilherme Rodrigues',
        role: 'Coordenador Geral Adjunto',
        department: 'geral',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Guilherme%20Rodrigues.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(2)
    },

    // Financeiro
    {
        id: 'luiz-ricardo',
        name: 'Luiz Ricardo',
        role: 'Coordenador Financeiro',
        department: 'financeiro',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Luiz%20Ricardo.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(3)
    },
    {
        id: 'lavinia-smargiassi',
        name: 'Lavínia Smargiassi',
        role: 'Coordenadora Adjunta Financeira',
        department: 'financeiro',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Lav%C3%ADnia%20Let%C3%ADcia.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(4)
    },
    {
        id: 'lucas-de-souza',
        name: 'Lucas de Souza',
        role: 'Assessor Financeiro',
        department: 'financeiro',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Lucas%20de%20souza.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(5)
    },
    {
        id: 'theo-mertzig',
        name: 'Theo Mertzig',
        role: 'Assessor Financeiro',
        department: 'financeiro',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Theo%20Mertzig.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(6)
    },
    {
        id: 'icaro-david',
        name: 'Ícaro David',
        role: 'Assessor Financeiro',
        department: 'financeiro',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/%C3%8Dcaro%20David.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(7)
    },

    // Comunicação e Marketing
    {
        id: 'renan-costa',
        name: 'Renan Costa',
        role: 'Coordenador de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Renan%20Costa.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(8)
    },
    {
        id: 'wesley-marques',
        name: 'Wesley Marques',
        role: 'Coordenador Adjunto de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Wesley%20Marques.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(9)
    },
    {
        id: 'ana-helena',
        name: 'Ana Helena',
        role: 'Assessora de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Ana%20Helena.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(10)
    },
    {
        id: 'maria-eduarda',
        name: 'Maria Eduarda',
        role: 'Assessora de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Maria%20Eduarda.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(11)
    },
    {
        id: 'tainah-araujo',
        name: 'Tainah Araújo',
        role: 'Assessora de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Tainah%20Ara%C3%BAjo.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(12)
    },
    {
        id: 'tiago-costa',
        name: 'Tiago Costa',
        role: 'Assessor de C&M',
        department: 'marketing',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Tiago%20Costa.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(13)
    },

    // Projetos e Eventos
    {
        id: 'camille-victoria',
        name: 'Camille Victoria',
        role: 'Coordenadora de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Camille%20Victoria.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(14)
    },
    {
        id: 'gabriel-nogueira',
        name: 'Gabriel Nogueira',
        role: 'Coordenador Adjunto de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriel%20Nogueira.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(15)
    },
    {
        id: 'carla-fernanda',
        name: 'Carla Fernanda',
        role: 'Assessora de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Carla%20Fernanda.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(16)
    },
    {
        id: 'gabriella-policarpo',
        name: 'Gabriella Policarpo',
        role: 'Assessora de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriella%20Policarpo.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(17)
    },
    {
        id: 'luiz-gustavo',
        name: 'Luiz Gustavo',
        role: 'Assessor de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Luiz%20Gustavo.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(18)
    },
    {
        id: 'willian-diego',
        name: 'Willian Diego',
        role: 'Assessor de Projetos',
        department: 'projetos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Willian%20Diego.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(19)
    },

    // Gestão da Qualidade
    {
        id: 'isadora-de-sa',
        name: 'Isadora de Sá',
        role: 'Coordenadora de Qualidade',
        department: 'qualidade',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Isadora%20de%20S%C3%A1.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(20)
    },
    {
        id: 'davi-borges',
        name: 'Davi Borges',
        role: 'Coordenador Adjunto de Qualidade',
        department: 'qualidade',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Davi%20Borges.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(21)
    },
    {
        id: 'leonardo-cristofer',
        name: 'Leonardo Cristofer',
        role: 'Assessor de Qualidade',
        department: 'qualidade',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/IMG_0020.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(22)
    },

    // Tecnologia da Informação
    {
        id: 'enzo-marcelino',
        name: 'Enzo Marcelino',
        role: 'Coordenador de TI',
        department: 'ti',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Enzo%20Marcelino.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(23)
    },

    // Documentos
    {
        id: 'theo-bianco',
        name: 'Theo Bianco',
        role: 'Coordenador de Documentos',
        department: 'documentos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Theo%20Bianco.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(24)
    },
    {
        id: 'fernando-lucas',
        name: 'Fernando Lucas',
        role: 'Coordenador Adjunto de Documentos',
        department: 'documentos',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Fernando%20Lucas.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(25)
    },

    // Gestão de Pessoas
    {
        id: 'maria-de-lourdes',
        name: 'Maria de Lourdes',
        role: 'Coordenadora de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Maria%20de%20Lourdes.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(26)
    },
    {
        id: 'thalita-correa',
        name: 'Thalita Correa',
        role: 'Coordenadora Adjunta de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Thalita%20Correa.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(27)
    },
    {
        id: 'maria-clara',
        name: 'Maria Clara',
        role: 'Assessora de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Maria%20Clara.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(28)
    },
    {
        id: 'gabriela-de-moura',
        name: 'Gabriela de Moura',
        role: 'Assessora de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriela%20de%20Moura.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(29)
    },
    {
        id: 'gabriel-cazita',
        name: 'Gabriel Cazita',
        role: 'Assessor de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriel%20Cazita.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(30)
    },
    {
        id: 'luiza-graves',
        name: 'Luiza Graves',
        role: 'Assessora de Gestão de Pessoas',
        department: 'pessoas',
        photo: 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Luiza%20Graves.JPG',
        email: '',
        phone: '',
        freeSlots: generateSampleSlots(31)
    }
];

// Gerenciador do Storage & Senha de Administração de 6 dígitos
const STORAGE_KEY = 'creajr_freetime_data_v2';
const PIN_STORAGE_KEY = 'creajr_admin_pin_v1';
const DEFAULT_PIN = '123456'; // Senha padrão inicial de 6 dígitos

function getAdminPin() {
    try {
        const pin = localStorage.getItem(PIN_STORAGE_KEY);
        if (pin && pin.length === 6) return pin;
    } catch (e) {}
    return DEFAULT_PIN;
}

function setAdminPin(newPin) {
    if (!newPin || newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
        return false;
    }
    try {
        localStorage.setItem(PIN_STORAGE_KEY, newPin);
        return true;
    } catch (e) {
        return false;
    }
}

function loadStoredData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
                return parsed.members;
            }
        }
    } catch (e) {
        console.error('Erro ao ler do localStorage:', e);
    }
    return INITIAL_MEMBERS;
}

function saveStoredData(members) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            updatedAt: new Date().toISOString(),
            members: members
        }));
        return true;
    } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
        return false;
    }
}

function resetToDefaultData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return JSON.parse(JSON.stringify(INITIAL_MEMBERS));
}
