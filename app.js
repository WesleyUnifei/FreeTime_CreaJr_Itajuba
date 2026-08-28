/**
 * APLICAÇÃO PRINCIPAL - FREE TIME & AGENDAMENTO DE REUNIÕES
 * CREA-JR NÚCLEO ITAJUBÁ
 */

// Estado global da aplicação
const state = {
    members: [],
    currentMemberId: 'victor-de-faria',
    currentBrush: 'free', // 'free' ou 'busy'
    isMouseDown: false,
    dragAction: null, // 'add' ou 'remove'
    meetingSelectedIds: new Set(['victor-de-faria', 'guilherme-rodrigues']),
    currentDeptFilter: 'todos',
    heatmapDeptFilter: 'todos',
    includeSaturday: false,
    isAdminAuthenticated: false
};

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    state.members = loadStoredData();
    
    // Se o membro inicial não existir mais, pega o primeiro
    if (!state.members.some(m => m.id === state.currentMemberId) && state.members.length > 0) {
        state.currentMemberId = state.members[0].id;
    }
    
    initTabs();
    initMemberSelector();
    renderIndividualSchedule();
    initDragEvents();
    renderMeetingParticipants();
    renderMeetingSchedule();
    renderHeatmap();
    renderMembersDirectory();
    initActionButtons();
    initPinAuthEvents();
    initAdminEvents();
});

/* ==========================================================================
   1. NAVEGAÇÃO DE ABAS
   ========================================================================== */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');

            if (targetTab === 'tab-freetime') {
                renderIndividualSchedule();
            } else if (targetTab === 'tab-reunioes') {
                renderMeetingParticipants();
                renderMeetingSchedule();
            } else if (targetTab === 'tab-heatmap') {
                renderHeatmap();
            } else if (targetTab === 'tab-membros') {
                renderMembersDirectory();
            }
        });
    });
}

function switchTab(tabId) {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.click();
}

/* ==========================================================================
   2. ABA 1: MEU FREE TIME (INDIVIDUAL)
   ========================================================================== */
function initMemberSelector() {
    const select = document.getElementById('memberSelect');
    if (!select) return;

    select.innerHTML = '';
    
    // Agrupa por diretoria
    DEPARTMENTS.forEach(dept => {
        const deptMembers = state.members.filter(m => m.department === dept.id);
        if (deptMembers.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = dept.name;
            deptMembers.forEach(member => {
                const opt = document.createElement('option');
                opt.value = member.id;
                opt.textContent = `${member.name} (${member.role})`;
                if (member.id === state.currentMemberId) opt.selected = true;
                optgroup.appendChild(opt);
            });
            select.appendChild(optgroup);
        }
    });

    select.addEventListener('change', (e) => {
        state.currentMemberId = e.target.value;
        renderIndividualSchedule();
    });

    // Pincel Livre / Ocupado
    const btnBrushFree = document.getElementById('brushFree');
    const btnBrushBusy = document.getElementById('brushBusy');

    if (btnBrushFree && btnBrushBusy) {
        btnBrushFree.addEventListener('click', () => {
            state.currentBrush = 'free';
            btnBrushFree.classList.add('active-free');
            btnBrushBusy.classList.remove('active-busy');
        });

        btnBrushBusy.addEventListener('click', () => {
            state.currentBrush = 'busy';
            btnBrushBusy.classList.add('active-busy');
            btnBrushFree.classList.remove('active-free');
        });
    }
}

function getCurrentMember() {
    return state.members.find(m => m.id === state.currentMemberId) || state.members[0];
}

function renderIndividualSchedule() {
    const member = getCurrentMember();
    if (!member) return;

    // Atualiza o card de info do membro
    const photoEl = document.getElementById('currentMemberPhoto');
    const nameEl = document.getElementById('currentMemberName');
    const roleEl = document.getElementById('currentMemberRole');
    const badgeEl = document.getElementById('currentMemberDeptBadge');
    const freeSlotsCountEl = document.getElementById('currentMemberFreeCount');
    const freeHoursCountEl = document.getElementById('currentMemberFreeHours');

    if (photoEl) photoEl.src = member.photo || 'https://via.placeholder.com/150';
    if (nameEl) nameEl.textContent = member.name;
    if (roleEl) roleEl.textContent = member.role;

    const dept = DEPARTMENTS.find(d => d.id === member.department) || { name: member.department, color: '#0033A0', bgLight: '#e6f0ff' };
    if (badgeEl) {
        badgeEl.textContent = dept.name;
        badgeEl.style.backgroundColor = dept.bgLight;
        badgeEl.style.color = dept.color;
    }

    const freeCount = member.freeSlots ? member.freeSlots.length : 0;
    if (freeSlotsCountEl) freeSlotsCountEl.textContent = freeCount;
    const approxHours = ((freeCount * 55) / 60).toFixed(1);
    if (freeHoursCountEl) freeHoursCountEl.textContent = `${approxHours}h`;

    // Renderiza a grade HTML
    const gridTbody = document.getElementById('individualGridTbody');
    if (!gridTbody) return;

    const visibleDays = DAYS;
    let html = '';

    PERIODS.forEach(period => {
        html += `
            <tr class="period-divider-row">
                <td colspan="${visibleDays.length + 1}">
                    <strong>${period.name.toUpperCase()}</strong> (Blocos ${period.slots[0].id} a ${period.slots[period.slots.length - 1].id})
                </td>
            </tr>
        `;

        period.slots.forEach(slot => {
            let tagClass = 'tag-manha';
            if (period.id === 'tarde') tagClass = 'tag-tarde';
            if (period.id === 'noite') tagClass = 'tag-noite';

            html += `<tr>`;
            html += `
                <td class="time-cell">
                    <span class="time-slot-tag ${tagClass}">${slot.label}</span>
                    <span>${slot.time}</span>
                </td>
            `;

            visibleDays.forEach(day => {
                const slotKey = `${day.id}_${slot.id}`;
                const isFree = member.freeSlots && member.freeSlots.includes(slotKey);
                html += `
                    <td class="slot-cell ${isFree ? 'is-free' : 'is-busy'}" 
                        data-slot-key="${slotKey}"
                        title="${day.name} - ${slot.label} (${slot.time}) - ${isFree ? 'Livre' : 'Ocupado'}">
                    </td>
                `;
            });

            html += `</tr>`;
        });
    });

    gridTbody.innerHTML = html;
}

/* ==========================================================================
   3. SISTEMA DE ARRASTAR E PREENCHER (DRAG & PAINT)
   ========================================================================== */
function initDragEvents() {
    const tableContainer = document.getElementById('individualScheduleGrid');
    if (!tableContainer) return;

    const handleSlotAction = (targetCell) => {
        if (!targetCell || !targetCell.classList.contains('slot-cell')) return;
        const slotKey = targetCell.getAttribute('data-slot-key');
        if (!slotKey) return;

        const member = getCurrentMember();
        if (!member) return;
        if (!member.freeSlots) member.freeSlots = [];

        const hasSlot = member.freeSlots.includes(slotKey);

        if (state.dragAction === 'add') {
            if (!hasSlot) {
                member.freeSlots.push(slotKey);
                targetCell.classList.add('is-free');
                targetCell.classList.remove('is-busy');
            }
        } else if (state.dragAction === 'remove') {
            if (hasSlot) {
                member.freeSlots = member.freeSlots.filter(s => s !== slotKey);
                targetCell.classList.remove('is-free');
                targetCell.classList.add('is-busy');
            }
        }

        updateMemberCounters(member);
    };

    // MOUSE EVENTS
    tableContainer.addEventListener('mousedown', (e) => {
        const cell = e.target.closest('.slot-cell');
        if (!cell) return;
        e.preventDefault();

        state.isMouseDown = true;
        const slotKey = cell.getAttribute('data-slot-key');
        const member = getCurrentMember();
        const isCurrentlyFree = member.freeSlots && member.freeSlots.includes(slotKey);

        if (state.currentBrush === 'free') {
            state.dragAction = isCurrentlyFree ? 'remove' : 'add';
        } else {
            state.dragAction = 'remove';
        }

        handleSlotAction(cell);
    });

    tableContainer.addEventListener('mouseover', (e) => {
        if (!state.isMouseDown) return;
        const cell = e.target.closest('.slot-cell');
        if (cell) {
            handleSlotAction(cell);
        }
    });

    window.addEventListener('mouseup', () => {
        if (state.isMouseDown) {
            state.isMouseDown = false;
            state.dragAction = null;
            saveStoredData(state.members);
            showToast('Horários atualizados e salvos!');
        }
    });

    // TOUCH EVENTS
    tableContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = elem ? elem.closest('.slot-cell') : null;
        if (!cell) return;

        state.isMouseDown = true;
        const slotKey = cell.getAttribute('data-slot-key');
        const member = getCurrentMember();
        const isCurrentlyFree = member.freeSlots && member.freeSlots.includes(slotKey);

        if (state.currentBrush === 'free') {
            state.dragAction = isCurrentlyFree ? 'remove' : 'add';
        } else {
            state.dragAction = 'remove';
        }

        handleSlotAction(cell);
    }, { passive: true });

    tableContainer.addEventListener('touchmove', (e) => {
        if (!state.isMouseDown) return;
        const touch = e.touches[0];
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = elem ? elem.closest('.slot-cell') : null;
        if (cell) {
            handleSlotAction(cell);
        }
    }, { passive: true });

    tableContainer.addEventListener('touchend', () => {
        if (state.isMouseDown) {
            state.isMouseDown = false;
            state.dragAction = null;
            saveStoredData(state.members);
            showToast('Horários salvos!');
        }
    });
}

function updateMemberCounters(member) {
    const freeSlotsCountEl = document.getElementById('currentMemberFreeCount');
    const freeHoursCountEl = document.getElementById('currentMemberFreeHours');

    const count = member.freeSlots ? member.freeSlots.length : 0;
    if (freeSlotsCountEl) freeSlotsCountEl.textContent = count;
    const approxHours = ((count * 55) / 60).toFixed(1);
    if (freeHoursCountEl) freeHoursCountEl.textContent = `${approxHours}h`;
}

/* ==========================================================================
   4. AÇÕES RÁPIDAS (BOTÕES PREENCHER MANHÃ/TARDE/NOITE/LIMPAR)
   ========================================================================== */
function initActionButtons() {
    const member = () => getCurrentMember();
    const days = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

    const btnFillManha = document.getElementById('btnFillManha');
    if (btnFillManha) {
        btnFillManha.addEventListener('click', () => {
            const m = member();
            if (!m.freeSlots) m.freeSlots = [];
            days.forEach(d => {
                ['M1', 'M2', 'M3', 'M4', 'M5'].forEach(s => {
                    const key = `${d}_${s}`;
                    if (!m.freeSlots.includes(key)) m.freeSlots.push(key);
                });
            });
            saveStoredData(state.members);
            renderIndividualSchedule();
            showToast('Turno da Manhã preenchido como Livre!');
        });
    }

    const btnFillTarde = document.getElementById('btnFillTarde');
    if (btnFillTarde) {
        btnFillTarde.addEventListener('click', () => {
            const m = member();
            if (!m.freeSlots) m.freeSlots = [];
            days.forEach(d => {
                ['T1', 'T2', 'T3', 'T4', 'T5'].forEach(s => {
                    const key = `${d}_${s}`;
                    if (!m.freeSlots.includes(key)) m.freeSlots.push(key);
                });
            });
            saveStoredData(state.members);
            renderIndividualSchedule();
            showToast('Turno da Tarde preenchido como Livre!');
        });
    }

    const btnFillNoite = document.getElementById('btnFillNoite');
    if (btnFillNoite) {
        btnFillNoite.addEventListener('click', () => {
            const m = member();
            if (!m.freeSlots) m.freeSlots = [];
            days.forEach(d => {
                ['N1', 'N2', 'N3', 'N4', 'N5'].forEach(s => {
                    const key = `${d}_${s}`;
                    if (!m.freeSlots.includes(key)) m.freeSlots.push(key);
                });
            });
            saveStoredData(state.members);
            renderIndividualSchedule();
            showToast('Turno da Noite preenchido como Livre!');
        });
    }

    const btnFillAll = document.getElementById('btnFillAll');
    if (btnFillAll) {
        btnFillAll.addEventListener('click', () => {
            const m = member();
            m.freeSlots = [];
            days.forEach(d => {
                ALL_SLOTS.forEach(s => {
                    m.freeSlots.push(`${d}_${s.id}`);
                });
            });
            saveStoredData(state.members);
            renderIndividualSchedule();
            showToast('Todos os horários marcados como Livres!');
        });
    }

    const btnClearAll = document.getElementById('btnClearAll');
    if (btnClearAll) {
        btnClearAll.addEventListener('click', () => {
            if (confirm('Deseja limpar todos os horários livres deste membro?')) {
                const m = member();
                m.freeSlots = [];
                saveStoredData(state.members);
                renderIndividualSchedule();
                showToast('Horários limpos com sucesso!');
            }
        });
    }

    const btnExportJson = document.getElementById('btnExportJson');
    if (btnExportJson) {
        btnExportJson.addEventListener('click', exportDataJson);
    }

    const btnImportJson = document.getElementById('btnImportJson');
    const inputImportFile = document.getElementById('inputImportFile');
    if (btnImportJson && inputImportFile) {
        btnImportJson.addEventListener('click', () => inputImportFile.click());
        inputImportFile.addEventListener('change', importDataJson);
    }

    const btnResetData = document.getElementById('btnResetData');
    if (btnResetData) {
        btnResetData.addEventListener('click', () => {
            if (confirm('Restaurar a base padrão com as fotos e membros originais do Crea-Jr Itajubá?')) {
                state.members = resetToDefaultData();
                syncEntireSite();
                showToast('Dados restaurados com sucesso!');
            }
        });
    }

    const btnPrint = document.getElementById('btnPrint');
    if (btnPrint) {
        btnPrint.addEventListener('click', () => window.print());
    }
}

/* ==========================================================================
   5. ABA 2: MATCH DE REUNIÕES (COMBINAÇÃO DE PESSOAS)
   ========================================================================== */
function renderMeetingParticipants() {
    const listContainer = document.getElementById('meetingParticipantsList');
    const filterInput = document.getElementById('searchMeetingParticipant');
    const deptChipsContainer = document.getElementById('meetingDeptChips');
    if (!listContainer) return;

    if (deptChipsContainer) {
        let chipsHtml = `<button class="dept-chip" onclick="selectAllParticipants()">Todos (${state.members.length})</button>`;
        chipsHtml += `<button class="dept-chip" onclick="clearAllParticipants()">Limpar Seleção</button>`;
        
        DEPARTMENTS.forEach(dept => {
            const count = state.members.filter(m => m.department === dept.id).length;
            if (count > 0) {
                chipsHtml += `<button class="dept-chip" onclick="selectDeptParticipants('${dept.id}')">${dept.name} (${count})</button>`;
            }
        });
        deptChipsContainer.innerHTML = chipsHtml;
    }

    const searchTerm = filterInput ? filterInput.value.toLowerCase().trim() : '';

    let html = '';
    state.members.forEach(member => {
        if (searchTerm && !member.name.toLowerCase().includes(searchTerm) && !member.role.toLowerCase().includes(searchTerm)) {
            return;
        }

        const isSelected = state.meetingSelectedIds.has(member.id);
        const dept = DEPARTMENTS.find(d => d.id === member.department) || { name: member.department };

        html += `
            <div class="participant-item ${isSelected ? 'selected' : ''}" onclick="toggleMeetingParticipant('${member.id}')">
                <input type="checkbox" ${isSelected ? 'checked' : ''} style="pointer-events: none;">
                <img src="${member.photo || 'https://via.placeholder.com/50'}" class="participant-avatar" alt="${member.name}">
                <div class="participant-info">
                    <div class="participant-name">${member.name}</div>
                    <div class="participant-dept">${member.role} • ${dept.name}</div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;
    updateSelectedCountDisplay();
}

function updateSelectedCountDisplay() {
    const countEl = document.getElementById('selectedParticipantsCount');
    if (countEl) {
        countEl.textContent = `${state.meetingSelectedIds.size} selecionado(s)`;
    }
}

function toggleMeetingParticipant(memberId) {
    if (state.meetingSelectedIds.has(memberId)) {
        state.meetingSelectedIds.delete(memberId);
    } else {
        state.meetingSelectedIds.add(memberId);
    }
    renderMeetingParticipants();
    renderMeetingSchedule();
}

function selectDeptParticipants(deptId) {
    const deptMembers = state.members.filter(m => m.department === deptId);
    deptMembers.forEach(m => state.meetingSelectedIds.add(m.id));
    renderMeetingParticipants();
    renderMeetingSchedule();
    showToast(`Membros da diretoria selecionados!`);
}

function selectAllParticipants() {
    state.members.forEach(m => state.meetingSelectedIds.add(m.id));
    renderMeetingParticipants();
    renderMeetingSchedule();
}

function clearAllParticipants() {
    state.meetingSelectedIds.clear();
    renderMeetingParticipants();
    renderMeetingSchedule();
}

const searchInput = document.getElementById('searchMeetingParticipant');
if (searchInput) {
    searchInput.addEventListener('input', renderMeetingParticipants);
}

function renderMeetingSchedule() {
    const gridTbody = document.getElementById('meetingGridTbody');
    const bestSlotsContainer = document.getElementById('bestMeetingSlots');
    if (!gridTbody) return;

    const selectedMembers = state.members.filter(m => state.meetingSelectedIds.has(m.id));
    const totalSelected = selectedMembers.length;

    if (totalSelected === 0) {
        gridTbody.innerHTML = `
            <tr>
                <td colspan="7" style="padding: 40px; text-align: center; color: var(--text-muted);">
                    <strong>Nenhum membro selecionado.</strong><br>
                    Selecione 2 ou mais membros na lista ao lado para calcular os horários em comum para a reunião.
                </td>
            </tr>
        `;
        if (bestSlotsContainer) bestSlotsContainer.innerHTML = '<p style="color: var(--text-muted);">Selecione membros para ver as sugestões de horários.</p>';
        return;
    }

    const visibleDays = DAYS;
    let html = '';
    const perfectSlots = [];

    PERIODS.forEach(period => {
        html += `
            <tr class="period-divider-row">
                <td colspan="${visibleDays.length + 1}">
                    <strong>${period.name.toUpperCase()}</strong>
                </td>
            </tr>
        `;

        period.slots.forEach(slot => {
            html += `<tr>`;
            html += `
                <td class="time-cell">
                    <span class="time-slot-tag">${slot.label}</span>
                    <span>${slot.time}</span>
                </td>
            `;

            visibleDays.forEach(day => {
                const slotKey = `${day.id}_${slot.id}`;
                
                const freeMembers = selectedMembers.filter(m => m.freeSlots && m.freeSlots.includes(slotKey));
                const freeCount = freeMembers.length;
                const ratio = freeCount / totalSelected;

                let matchClass = 'match-none';
                let labelText = `${freeCount}/${totalSelected}`;

                if (freeCount === totalSelected) {
                    matchClass = 'match-100';
                    labelText = '⭐ 100% Livre';
                    perfectSlots.push({
                        day: day.name,
                        dayId: day.id,
                        slot: slot.label,
                        time: slot.time,
                        slotId: slot.id
                    });
                } else if (ratio >= 0.75) {
                    matchClass = 'match-high';
                } else if (ratio >= 0.5) {
                    matchClass = 'match-med';
                } else if (freeCount > 0) {
                    matchClass = 'match-low';
                }

                html += `
                    <td class="match-cell ${matchClass}" 
                        onclick="showSlotDetailModal('${day.name}', '${slot.label}', '${slot.time}', '${slotKey}')"
                        title="${day.name} - ${slot.label}: ${freeCount} de ${totalSelected} livres. Clique para ver detalhes.">
                        ${labelText}
                    </td>
                `;
            });

            html += `</tr>`;
        });
    });

    gridTbody.innerHTML = html;
    renderBestMeetingSlots(perfectSlots, totalSelected);
}

function renderBestMeetingSlots(perfectSlots, totalSelected) {
    const container = document.getElementById('bestMeetingSlots');
    if (!container) return;

    if (perfectSlots.length === 0) {
        container.innerHTML = `
            <div style="background: #fff8e6; border: 1px solid #fde047; padding: 12px 16px; border-radius: var(--radius-sm); color: #854d0e;">
                ⚠️ Não há nenhum horário com <strong>100%</strong> dos ${totalSelected} membros livres ao mesmo tempo. 
                Tente verificar os horários em amarelo/verde claro na tabela onde a grande maioria está disponível!
            </div>
        `;
        return;
    }

    let cardsHtml = '';
    perfectSlots.slice(0, 8).forEach(s => {
        cardsHtml += `
            <div class="meeting-slot-card">
                <div>
                    <div class="slot-day">${s.day}</div>
                    <div class="slot-time">Bloco ${s.slot} (${s.time})</div>
                </div>
                <span class="badge" style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: 700; font-size: 0.75rem;">
                    100% Livre
                </span>
            </div>
        `;
    });

    container.innerHTML = cardsHtml;
}

function showSlotDetailModal(dayName, slotLabel, slotTime, slotKey) {
    const modal = document.getElementById('slotDetailModal');
    const modalTitle = document.getElementById('slotModalTitle');
    const modalFreeList = document.getElementById('slotModalFreeList');
    const modalBusyList = document.getElementById('slotModalBusyList');

    if (!modal) return;

    const selectedMembers = state.members.filter(m => state.meetingSelectedIds.has(m.id));
    const freeMembers = selectedMembers.filter(m => m.freeSlots && m.freeSlots.includes(slotKey));
    const busyMembers = selectedMembers.filter(m => !m.freeSlots || !m.freeSlots.includes(slotKey));

    if (modalTitle) {
        modalTitle.textContent = `${dayName} - ${slotLabel} (${slotTime})`;
    }

    if (modalFreeList) {
        if (freeMembers.length === 0) {
            modalFreeList.innerHTML = '<li style="color: var(--text-muted); font-size: 0.85rem;">Nenhum membro livre</li>';
        } else {
            modalFreeList.innerHTML = freeMembers.map(m => `
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <img src="${m.photo || 'https://via.placeholder.com/30'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                    <span style="font-weight: 600; font-size: 0.88rem;">${m.name}</span>
                    <span style="font-size: 0.75rem; color: #10b981;">(Livre)</span>
                </li>
            `).join('');
        }
    }

    if (modalBusyList) {
        if (busyMembers.length === 0) {
            modalBusyList.innerHTML = '<li style="color: #10b981; font-weight: 700; font-size: 0.85rem;">✨ Todos os selecionados estão 100% livres!</li>';
        } else {
            modalBusyList.innerHTML = busyMembers.map(m => `
                <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <img src="${m.photo || 'https://via.placeholder.com/30'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
                    <span style="font-weight: 600; font-size: 0.88rem;">${m.name}</span>
                    <span style="font-size: 0.75rem; color: #ef4444;">(Ocupado)</span>
                </li>
            `).join('');
        }
    }

    modal.classList.add('open');
}

function closeSlotModal() {
    const modal = document.getElementById('slotDetailModal');
    if (modal) modal.classList.remove('open');
}

/* ==========================================================================
   6. ABA 3: HEATMAP DA EQUIPE (VISÃO GERAL)
   ========================================================================== */
function renderHeatmap() {
    const gridTbody = document.getElementById('heatmapGridTbody');
    if (!gridTbody) return;

    const filteredMembers = state.heatmapDeptFilter === 'todos' 
        ? state.members 
        : state.members.filter(m => m.department === state.heatmapDeptFilter);

    const total = filteredMembers.length;
    const visibleDays = DAYS;
    let html = '';

    PERIODS.forEach(period => {
        html += `
            <tr class="period-divider-row">
                <td colspan="${visibleDays.length + 1}">
                    <strong>${period.name.toUpperCase()}</strong>
                </td>
            </tr>
        `;

        period.slots.forEach(slot => {
            html += `<tr>`;
            html += `
                <td class="time-cell">
                    <span class="time-slot-tag">${slot.label}</span>
                    <span>${slot.time}</span>
                </td>
            `;

            visibleDays.forEach(day => {
                const slotKey = `${day.id}_${slot.id}`;
                const freeCount = filteredMembers.filter(m => m.freeSlots && m.freeSlots.includes(slotKey)).length;
                const ratio = total > 0 ? (freeCount / total) : 0;

                let bgStyle = 'background: #f8fafc; color: #64748b;';
                if (ratio > 0) {
                    const intensity = Math.round(ratio * 100);
                    if (intensity > 60) {
                        bgStyle = `background: rgba(0, 51, 160, ${0.3 + (ratio * 0.7)}); color: #ffffff; font-weight: 800;`;
                    } else if (intensity > 30) {
                        bgStyle = `background: rgba(0, 119, 181, ${0.2 + (ratio * 0.6)}); color: #00226C; font-weight: 700;`;
                    } else {
                        bgStyle = `background: rgba(137, 207, 240, ${0.2 + (ratio * 0.5)}); color: #0033A0;`;
                    }
                }

                html += `
                    <td style="${bgStyle}; font-size: 0.8rem; cursor: default;" title="${day.name} ${slot.label}: ${freeCount} membros livres">
                        <strong>${freeCount}</strong> <span style="font-size: 0.7rem; opacity: 0.8;">livres</span>
                    </td>
                `;
            });

            html += `</tr>`;
        });
    });

    gridTbody.innerHTML = html;
}

const heatmapDeptSelect = document.getElementById('heatmapDeptFilter');
if (heatmapDeptSelect) {
    heatmapDeptSelect.addEventListener('change', (e) => {
        state.heatmapDeptFilter = e.target.value;
        renderHeatmap();
    });
}

/* ==========================================================================
   7. ABA 4: DIRETÓRIO DE MEMBROS E FOTOS
   ========================================================================== */
function renderMembersDirectory() {
    const container = document.getElementById('membersDirectoryContainer');
    const deptFilterEl = document.getElementById('dirDeptFilter');
    if (!container) return;

    const filterDept = deptFilterEl ? deptFilterEl.value : 'todos';

    const deptsToShow = filterDept === 'todos' 
        ? DEPARTMENTS 
        : DEPARTMENTS.filter(d => d.id === filterDept);

    let html = '';

    deptsToShow.forEach(dept => {
        const deptMembers = state.members.filter(m => m.department === dept.id);
        if (deptMembers.length === 0) return;

        html += `
            <div style="margin-bottom: 32px;">
                <h3 style="font-family: 'Montserrat', sans-serif; color: ${dept.color}; font-size: 1.3rem; border-bottom: 2px solid ${dept.color}; padding-bottom: 8px; margin-bottom: 16px;">
                    ${dept.name} (${deptMembers.length})
                </h3>
                <div class="members-grid-view">
        `;

        deptMembers.forEach(member => {
            const freeSlotsCount = member.freeSlots ? member.freeSlots.length : 0;
            const approxHours = ((freeSlotsCount * 55) / 60).toFixed(1);

            html += `
                <div class="member-dir-card">
                    <img src="${member.photo || 'https://via.placeholder.com/120'}" class="dir-photo" alt="${member.name}">
                    <h4>${member.name}</h4>
                    <p>${member.role}</p>
                    <div style="background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #0033A0; margin-bottom: 12px;">
                        ⏰ ${freeSlotsCount} blocos livres (~${approxHours}h)
                    </div>
                    <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="editMemberFreeTime('${member.id}')">
                        ✏️ Editar Horários
                    </button>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}

function editMemberFreeTime(memberId) {
    state.currentMemberId = memberId;
    const select = document.getElementById('memberSelect');
    if (select) select.value = memberId;
    switchTab('tab-freetime');
    renderIndividualSchedule();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Membro carregado para edição de horários!');
}

const dirDeptSelect = document.getElementById('dirDeptFilter');
if (dirDeptSelect) {
    dirDeptSelect.addEventListener('change', renderMembersDirectory);
}

/* ==========================================================================
   8. ÁREA RESTRITA: AUTENTICAÇÃO POR SENHA (PIN DE 6 DÍGITOS)
   ========================================================================== */
function initPinAuthEvents() {
    const btnOpenAdminHeader = document.getElementById('btnOpenAdminHeader');
    const btnOpenAdminDir = document.getElementById('btnOpenAdminDir');
    const pinInputs = document.querySelectorAll('.pin-digit-input');

    if (btnOpenAdminHeader) {
        btnOpenAdminHeader.addEventListener('click', openPinOrAdminModal);
    }
    if (btnOpenAdminDir) {
        btnOpenAdminDir.addEventListener('click', openPinOrAdminModal);
    }

    // Gerenciamento de foco e digitação dos 6 inputs
    pinInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value;
            // Mantém apenas dígitos
            if (!/^\d$/.test(val)) {
                e.target.value = '';
                return;
            }
            // Avança para o próximo dígito
            if (index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            } else {
                // Ao preencher o 6º dígito, dispara automaticamente a verificação
                setTimeout(() => {
                    const pinForm = document.getElementById('pinAuthForm');
                    if (pinForm) pinForm.requestSubmit();
                }, 50);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                pinInputs[index - 1].focus();
            }
        });

        // Suporte a colar senha de 6 dígitos
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(pasted)) {
                pasted.split('').forEach((char, i) => {
                    if (pinInputs[i]) pinInputs[i].value = char;
                });
                pinInputs[5].focus();
                setTimeout(() => {
                    const pinForm = document.getElementById('pinAuthForm');
                    if (pinForm) pinForm.requestSubmit();
                }, 50);
            }
        });
    });
}

function openPinOrAdminModal() {
    // Se já estiver autenticado na sessão atual, abre direto o painel admin
    if (state.isAdminAuthenticated) {
        openAdminModal();
    } else {
        openPinModal();
    }
}

function openPinModal() {
    const modal = document.getElementById('pinAuthModal');
    const pinInputs = document.querySelectorAll('.pin-digit-input');
    const errEl = document.getElementById('pinErrorMessage');

    if (errEl) errEl.textContent = '';
    pinInputs.forEach(i => i.value = '');

    if (modal) {
        modal.classList.add('open');
        setTimeout(() => {
            if (pinInputs[0]) pinInputs[0].focus();
        }, 100);
    }
}

function closePinModal() {
    const modal = document.getElementById('pinAuthModal');
    if (modal) modal.classList.remove('open');
}

function handlePinSubmit(e) {
    e.preventDefault();
    const pinInputs = document.querySelectorAll('.pin-digit-input');
    const enteredPin = Array.from(pinInputs).map(i => i.value).join('');
    const correctPin = getAdminPin();
    const errEl = document.getElementById('pinErrorMessage');
    const container = document.getElementById('pinDigitsContainer');

    if (enteredPin === correctPin) {
        state.isAdminAuthenticated = true;
        closePinModal();
        openAdminModal();
        showToast('🔓 Acesso de administrador liberado!');
    } else {
        if (errEl) errEl.textContent = '❌ Senha incorreta! Tente novamente.';
        if (container) {
            container.classList.add('shake-animation');
            setTimeout(() => container.classList.remove('shake-animation'), 450);
        }
        pinInputs.forEach(i => i.value = '');
        if (pinInputs[0]) pinInputs[0].focus();
    }
}

/* ==========================================================================
   9. PAINEL DE ADMINISTRAÇÃO DE MEMBROS (CRUD & SINCRONIZAÇÃO TOTAL)
   ========================================================================== */
const DEFAULT_MEMBER_AVATAR = 'https://raw.githubusercontent.com/Marketingcreajrmgitajuba12/Link-de-acesso-rapido/main/Processo%20Seletivo%202025.2%20-%201.png';

// Utilitário para redimensionar e otimizar foto do upload
function processUploadedImage(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 240;
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }
            
            canvas.width = Math.round(width);
            canvas.height = Math.round(height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            callback(optimizedDataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function initAdminEvents() {
    const searchAdmin = document.getElementById('searchAdminMembers');
    if (searchAdmin) {
        searchAdmin.addEventListener('input', renderAdminMembersTable);
    }

    const photoFileInput = document.getElementById('formMemberPhotoFile');
    const photoTextInput = document.getElementById('formMemberPhoto');
    const photoPreview = document.getElementById('formPhotoPreview');
    const btnResetPhoto = document.getElementById('btnResetFormPhoto');

    if (photoFileInput) {
        photoFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processUploadedImage(file, (base64Img) => {
                    if (photoPreview) photoPreview.src = base64Img;
                    if (photoTextInput) photoTextInput.value = base64Img;
                    showToast('Foto carregada do dispositivo com sucesso!');
                });
            }
        });
    }

    if (photoTextInput) {
        photoTextInput.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (photoPreview) {
                photoPreview.src = val || DEFAULT_MEMBER_AVATAR;
            }
        });
    }

    if (btnResetPhoto) {
        btnResetPhoto.addEventListener('click', () => {
            if (photoFileInput) photoFileInput.value = '';
            if (photoTextInput) photoTextInput.value = '';
            if (photoPreview) photoPreview.src = DEFAULT_MEMBER_AVATAR;
            showToast('Foto redefinida para o padrão.');
        });
    }
}

function openAdminModal() {
    const modal = document.getElementById('adminMembersModal');
    resetMemberForm();
    renderAdminMembersTable();
    if (modal) modal.classList.add('open');
}

function closeAdminModal() {
    const modal = document.getElementById('adminMembersModal');
    if (modal) modal.classList.remove('open');
}

function renderAdminMembersTable() {
    const tbody = document.getElementById('adminMembersTableBody');
    const totalCountEl = document.getElementById('adminTotalMembersCount');
    const searchInput = document.getElementById('searchAdminMembers');
    if (!tbody) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

    if (totalCountEl) totalCountEl.textContent = state.members.length;

    let html = '';
    state.members.forEach(member => {
        if (searchTerm && !member.name.toLowerCase().includes(searchTerm) && !member.role.toLowerCase().includes(searchTerm)) {
            return;
        }

        const dept = DEPARTMENTS.find(d => d.id === member.department) || { name: member.department, color: '#0033A0', bgLight: '#e6f0ff' };

        html += `
            <tr>
                <td>
                    <img src="${member.photo || DEFAULT_MEMBER_AVATAR}" class="admin-member-avatar" alt="${member.name}">
                    <strong>${member.name}</strong>
                </td>
                <td style="color: var(--text-muted);">${member.role}</td>
                <td>
                    <span style="background: ${dept.bgLight}; color: ${dept.color}; font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 12px;">
                        ${dept.name}
                    </span>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="btn btn-outline btn-sm" onclick="editAdminMember('${member.id}')" title="Editar dados e cargo">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteAdminMember('${member.id}')" title="Remover membro do núcleo">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `;
    });

    if (html === '') {
        html = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 20px;">Nenhum membro encontrado.</td></tr>`;
    }

    tbody.innerHTML = html;
}

// Salvar Membro (Adicionar ou Atualizar)
function handleSaveMemberForm(e) {
    e.preventDefault();
    
    const idInput = document.getElementById('editMemberId');
    const nameInput = document.getElementById('formMemberName');
    const roleInput = document.getElementById('formMemberRole');
    const deptInput = document.getElementById('formMemberDept');
    const photoInput = document.getElementById('formMemberPhoto');

    const memberId = idInput.value;
    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const department = deptInput.value;
    let photo = photoInput.value.trim();

    if (!photo) {
        photo = DEFAULT_MEMBER_AVATAR;
    }

    if (memberId) {
        // Editando membro existente
        const member = state.members.find(m => m.id === memberId);
        if (member) {
            member.name = name;
            member.role = role;
            member.department = department;
            member.photo = photo;
            showToast(`Membro "${name}" atualizado com sucesso!`);
        }
    } else {
        // Adicionando novo membro
        const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-") + '-' + Date.now().toString().slice(-4);
        
        const newMember = {
            id: slug,
            name: name,
            role: role,
            department: department,
            photo: photo,
            email: '',
            phone: '',
            freeSlots: generateSampleSlots(state.members.length + 1)
        };

        state.members.push(newMember);
        showToast(`Novo membro "${name}" adicionado com sucesso!`);
    }

    saveStoredData(state.members);
    resetMemberForm();
    renderAdminMembersTable();
    syncEntireSite();
}

function editAdminMember(memberId) {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    document.getElementById('editMemberId').value = member.id;
    document.getElementById('formMemberName').value = member.name;
    document.getElementById('formMemberRole').value = member.role;
    document.getElementById('formMemberDept').value = member.department;
    document.getElementById('formMemberPhoto').value = member.photo || '';

    const photoPreview = document.getElementById('formPhotoPreview');
    if (photoPreview) {
        photoPreview.src = member.photo || DEFAULT_MEMBER_AVATAR;
    }
    const photoFileInput = document.getElementById('formMemberPhotoFile');
    if (photoFileInput) photoFileInput.value = '';

    const titleEl = document.getElementById('adminFormTitle');
    if (titleEl) titleEl.innerHTML = `<span>✏️ Editando: <strong>${member.name}</strong></span>`;

    const btnCancel = document.getElementById('btnCancelEditMember');
    if (btnCancel) btnCancel.style.display = 'inline-flex';

    document.getElementById('formMemberName').focus();
}

function resetMemberForm() {
    const form = document.getElementById('memberEditForm');
    if (form) form.reset();

    document.getElementById('editMemberId').value = '';

    const photoPreview = document.getElementById('formPhotoPreview');
    if (photoPreview) {
        photoPreview.src = DEFAULT_MEMBER_AVATAR;
    }
    const photoFileInput = document.getElementById('formMemberPhotoFile');
    if (photoFileInput) photoFileInput.value = '';

    const titleEl = document.getElementById('adminFormTitle');
    if (titleEl) titleEl.innerHTML = `<span>➕ Adicionar Novo Membro</span>`;

    const btnCancel = document.getElementById('btnCancelEditMember');
    if (btnCancel) btnCancel.style.display = 'none';
}

function deleteAdminMember(memberId) {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return;

    if (confirm(`Tem certeza que deseja remover "${member.name}" (${member.role}) do núcleo?`)) {
        state.members = state.members.filter(m => m.id !== memberId);
        state.meetingSelectedIds.delete(memberId);

        if (state.currentMemberId === memberId && state.members.length > 0) {
            state.currentMemberId = state.members[0].id;
        }

        saveStoredData(state.members);
        renderAdminMembersTable();
        syncEntireSite();
        showToast(`Membro removido do sistema.`);
    }
}

function handleChangePin() {
    const pinInput = document.getElementById('newAdminPinInput');
    const newPin = pinInput ? pinInput.value.trim() : '';

    if (setAdminPin(newPin)) {
        showToast(`Nova senha de 6 dígitos salva com sucesso!`);
        pinInput.value = '';
    } else {
        alert('A senha deve conter exatamente 6 dígitos numéricos (ex: 202526).');
    }
}

// Sincronização em tempo real de todo o site
function syncEntireSite() {
    initMemberSelector();
    renderIndividualSchedule();
    renderMeetingParticipants();
    renderMeetingSchedule();
    renderHeatmap();
    renderMembersDirectory();
}

/* ==========================================================================
   10. EXPORTAÇÃO & IMPORTAÇÃO DE DADOS (BACKUP JSON)
   ========================================================================== */
function exportDataJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        version: "1.0",
        organization: "Crea-Jr Núcleo Itajubá",
        exportDate: new Date().toISOString(),
        members: state.members
    }, null, 2));

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `freetime_creajr_itajuba_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Arquivo de backup exportado com sucesso!');
}

function importDataJson(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const parsed = JSON.parse(event.target.result);
            if (parsed && Array.isArray(parsed.members)) {
                state.members = parsed.members;
                saveStoredData(state.members);
                syncEntireSite();
                showToast('Dados importados e site atualizado com sucesso!');
            } else {
                alert('Formato de arquivo inválido.');
            }
        } catch (err) {
            alert('Erro ao processar o arquivo JSON.');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

/* ==========================================================================
   11. UTILITÁRIOS: TOAST DE NOTIFICAÇÃO
   ========================================================================== */
function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotification';
        toast.className = 'toast-msg';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
