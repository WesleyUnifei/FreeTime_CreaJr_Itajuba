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

// Membros atuais do Crea-Jr Núcleo Itajubá
const INITIAL_MEMBERS = [
    {
        id: 'victor-de-faria',
        name: `Victor de Faria`,
        role: `Coordenador Geral`,
        department: 'geral',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/victor%20de%20faria.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","qua_T4","qua_T5","qua_M4","qua_M5","qui_T3","qui_T4","sex_N1","sex_N2","sab_T3","sab_T4","sab_T5"]
    },
    {
        id: 'lucas-de-souza',
        name: `Lucas de Souza`,
        role: `Assessor Financeiro`,
        department: 'financeiro',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Lucas%20de%20souza.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_N1","seg_N2","ter_T3","ter_T4","ter_T5","qua_M4","qua_M5","qui_T3","qui_T4","sex_T4","sex_T5","sab_T3","sab_T4","sab_N1","sab_N2"]
    },
    {
        id: 'theo-mertzig',
        name: `Theo Mertzig`,
        role: `Assessor Financeiro`,
        department: 'financeiro',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Theo%20Mertzig.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_T5","seg_M4","seg_M5","qua_T3","qua_T4","qui_T4","qui_T5","sex_T3","sex_T4","sex_M4","sex_M5","sex_N1","sex_N2","ter_T3","ter_T4","qui_T3"]
    },
    {
        id: 'wesley-marques',
        name: `Wesley Marques`,
        role: `Coordenador de C&M`,
        department: 'marketing',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Wesley%20Marques.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_M1","seg_M2","seg_M3","seg_M4","seg_M5","seg_N1","seg_N2","seg_N3","seg_N4","seg_N5","ter_N1","ter_N2","ter_N3","ter_N4","ter_N5","qua_M1","qua_M2","qua_M3","qua_M4","qua_M5","qua_N1","qua_N2","qua_N3","qua_N4","qua_N5","qui_N1","qui_N2","qui_N3","qui_N4","qui_N5","sex_M1","sex_M2","sex_M3","sex_T5","sex_N1","sex_N2","sex_N3","sex_N4","sex_N5","qui_T1","qui_T2"]
    },
    {
        id: 'camille-victoria',
        name: `Camille Victoria`,
        role: `Coordenadora de Projetos`,
        department: 'projetos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Camille%20Victoria.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_M4","seg_M5","ter_T4","ter_T5","ter_N1","ter_N2","qua_T3","qua_T4","sex_T3","sex_T4","sex_T5","sex_M4","sex_M5","ter_T3","qui_T3","qui_T4"]
    },
    {
        id: 'gabriel-nogueira',
        name: `Gabriel Nogueira`,
        role: `Coordenador Adjunto Geral`,
        department: 'geral',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriel%20Nogueira.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T4","seg_T5","seg_N1","seg_N2","ter_T3","ter_T4","qua_M4","qua_M5","qui_T3","qui_T4","qui_T5","sab_T3","sab_T4","sab_N1","sab_N2"]
    },
    {
        id: 'carla-fernanda',
        name: `Carla Fernanda`,
        role: `Assessora de Projetos`,
        department: 'projetos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Carla%20Fernanda.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_M4","seg_M5","qua_T3","qua_T4","qua_T5","sex_T3","sex_T4","sex_M4","sex_M5","sex_N1","sex_N2","sab_T4","sab_T5","ter_T3","ter_T4","qui_T3","qui_T4"]
    },
    {
        id: 'gabriella-policarpo',
        name: `Gabriella Policarpo`,
        role: `Assessora de Projetos`,
        department: 'projetos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriella%20Policarpo.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","ter_T5","qua_M4","qua_M5","qui_T3","qui_T4","qui_N1","qui_N2","sex_T4","sex_T5","sab_T3","sab_T4"]
    },
    {
        id: 'luiz-gustavo',
        name: `Luiz Gustavo`,
        role: `Assessor de Projetos`,
        department: 'projetos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Luiz%20Gustavo.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_T5","seg_M4","seg_M5","qua_T3","qua_T4","qua_N1","qua_N2","qui_T4","qui_T5","sex_T3","sex_T4","sex_M4","sex_M5","ter_T3","ter_T4","qui_T3"]
    },
    {
        id: 'willian-diego',
        name: `Willian Diego`,
        role: `Assessor de Projetos`,
        department: 'projetos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Willian%20Diego.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","ter_N1","ter_N2","qua_T4","qua_T5","qua_M4","qua_M5","qui_T3","qui_T4","sab_T3","sab_T4","sab_T5"]
    },
    {
        id: 'davi-borges',
        name: `Davi Borges`,
        role: `Coordenador de Qualidade`,
        department: 'qualidade',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Davi%20Borges.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T4","seg_T5","ter_T3","ter_T4","qua_M4","qua_M5","qui_T3","qui_T4","qui_T5","sex_N1","sex_N2","sab_T3","sab_T4"]
    },
    {
        id: 'enzo-marcelino',
        name: `Enzo Marcelino`,
        role: `Coordenador de TI`,
        department: 'ti',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Enzo%20Marcelino.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","ter_T5","qua_M4","qua_M5","qua_N1","qua_N2","qui_T3","qui_T4","sex_T4","sex_T5","sab_T3","sab_T4"]
    },
    {
        id: 'fernando-lucas',
        name: `Fernando Lucas`,
        role: `Coordenador Adjunto de Documentos`,
        department: 'documentos',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Fernando%20Lucas.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_N1","seg_N2","ter_T3","ter_T4","qua_T4","qua_T5","qua_M4","qua_M5","qui_T3","qui_T4","sab_T3","sab_T4","sab_T5","sab_N1","sab_N2"]
    },
    {
        id: 'gabriela-de-moura',
        name: `Gabriela de Moura`,
        role: `Assessora de Gestão de Pessoas`,
        department: 'pessoas',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriela%20de%20Moura.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","ter_T5","ter_N1","ter_N2","qua_M4","qua_M5","qui_T3","qui_T4","sex_T4","sex_T5","sab_T3","sab_T4"]
    },
    {
        id: 'gabriel-cazita',
        name: `Gabriel Cazita`,
        role: `Assessor de Gestão de Pessoas`,
        department: 'pessoas',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Gabriel%20Cazita.JPG`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_T5","seg_M4","seg_M5","seg_N1","seg_N2","qua_T3","qua_T4","qui_T4","qui_T5","sex_T3","sex_T4","sex_M4","sex_M5","sab_N1","sab_N2","ter_T3","ter_T4","qui_T3"]
    },
    {
        id: 'luiza-graves',
        name: `Luiza Graves`,
        role: `Assessora de Gestão de Pessoas`,
        department: 'pessoas',
        photo: `https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Luiza%20Graves.JPG`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","qua_T4","qua_T5","qua_M4","qua_M5","qui_T3","qui_T4","sex_N1","sex_N2","sab_T3","sab_T4","sab_T5"]
    },
    {
        id: 'ana-marcolino-2489',
        name: `Ana Marcolino`,
        role: `Assessora de C&M`,
        department: 'marketing',
        photo: `data:image/jpeg;base64,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`,
        email: '',
        phone: '',
        freeSlots: ["ter_T3","ter_T4","ter_T5","qua_M4","qua_M5","qui_T3","qui_T4","qui_N1","qui_N2","sex_T4","sex_T5","sab_T3","sab_T4"]
    },
    {
        id: 'leticia-silverio-6188',
        name: `Letícia Silvério`,
        role: `Assessora de Gestão de Pessoas`,
        department: 'pessoas',
        photo: `data:image/jpeg;base64,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`,
        email: '',
        phone: '',
        freeSlots: ["seg_T3","seg_T4","seg_T5","seg_M4","seg_M5","qua_T3","qua_T4","qua_N1","qua_N2","qui_T4","qui_T5","sex_T3","sex_T4","sex_M4","sex_M5","ter_T3","ter_T4","qui_T3"]
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
