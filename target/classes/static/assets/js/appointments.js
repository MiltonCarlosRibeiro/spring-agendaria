const AppointmentsUI = (() => {
// ID do corpo da tabela na nova página appointments.html
const tableBodyId = "appointmentsTableBody";
// ID da lista de cards na página index.html (mantido para compatibilidade)
const nextListId = "nextAppointments";

/**
 * Carrega a lista de próximos agendamentos e renderiza na UI.
 */
async function loadNextAppointments() {
    const tableBody = document.getElementById(tableBodyId);
    const cardsList = document.getElementById(nextListId);

    let targetEl;
    let isTable = false;

    if (tableBody) {
        targetEl = tableBody;
        isTable = true;
    } else if (cardsList) {
        targetEl = cardsList;
        isTable = false;
    } else {
        return;
    }

    // Feedback visual de carregamento
    targetEl.innerHTML = isTable
        ? '<tr><td colspan="6">Carregando agendamentos...</td></tr>'
        : '<p class="section-subtitle">Carregando agendamentos...</p>';

    try {
        const list = await Api.listNextAppointments();
        targetEl.innerHTML = "";

        if (!list.length) {
            targetEl.innerHTML = isTable
                ? '<tr class="table-info"><td colspan="6">Nenhum agendamento futuro.</td></tr>'
                : '<p class="section-subtitle">Nenhum agendamento futuro.</p>';
            return;
        }

        list.forEach((appt) => {
            if (isTable) {
                targetEl.appendChild(createAppointmentRow(appt));
            } else {
                targetEl.appendChild(createAppointmentCard(appt));
            }
        });
    } catch (e) {
        targetEl.innerHTML = isTable
            ? '<tr class="table-danger"><td colspan="6">Erro ao carregar agenda.</td></tr>'
            : '<p class="section-subtitle">Erro ao carregar agenda.</p>';
        console.error("Erro ao carregar agendamentos:", e);
    }
}

/**
 * Cria uma linha de tabela (<tr>) para a página appointments.html (utiliza classes Bootstrap).
 */
function createAppointmentRow(appt) {
    const tr = document.createElement("tr");

    let statusClass = appt.status === 'CANCELLED' ? 'text-danger fw-bold' : 'text-success';

    tr.innerHTML = `
        <td>${formatDateTime(appt.startDateTime)}</td>
        <td>${formatTime(appt.endDateTime)}</td>
        <td>${appt.customerName}</td>
        <td>${appt.procedureName}</td>
        <td class="${statusClass}">${appt.status}</td>
        <td>
            <button class="btn btn-sm btn-warning me-2" onclick="AppointmentsUI.handleReschedule(${appt.id})">Reagendar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="AppointmentsUI.handleCancel(${appt.id})">Cancelar</button>
        </td>
    `;
    return tr;
}

/**
 * Cria um card simples (<div>) para a página index.html.
 */
function createAppointmentCard(appt) {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = `${appt.customerName} - ${appt.procedureName}`;

    const subtitle = document.createElement("div");
    subtitle.className = "card-subtitle";
    subtitle.textContent = `${formatDateTime(
        appt.startDateTime
    )} até ${formatTime(appt.endDateTime)}`;

    const meta = document.createElement("div");
    meta.className = "card-meta";
    const st = document.createElement("span");
    st.textContent = appt.status;
    meta.appendChild(st);

    const actions = document.createElement("div");
    actions.className = "form-actions";

    const btnCancel = document.createElement("button");
    btnCancel.className = "btn btn-outline";
    btnCancel.textContent = "Cancelar";
    btnCancel.onclick = () => handleCancel(appt.id);

    const btnReschedule = document.createElement("button");
    btnReschedule.className = "btn btn-primary";
    btnReschedule.textContent = "Reagendar próximo";
    btnReschedule.onclick = () => handleReschedule(appt.id);

    actions.appendChild(btnCancel);
    actions.appendChild(btnReschedule);

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
}

async function handleCancel(id) {
    if (!confirm("Deseja realmente cancelar este horário?")) return;
    try {
        await Api.cancelAppointment(id, "cancelado pelo usuário via UI");
        alert("Agendamento cancelado com sucesso!");
        await loadNextAppointments();
    } catch (e) {
        alert("Erro ao cancelar agendamento.");
        console.error("Erro ao cancelar:", e);
    }
}

async function handleReschedule(id) {
    if (!confirm("Reagendar para o próximo horário disponível?")) return;
    try {
        await Api.rescheduleNext(id);
        alert("Agendamento reagendado com sucesso para o próximo horário!");
        await loadNextAppointments();
    } catch (e) {
        alert("Erro ao reagendar. Verifique a disponibilidade.");
        console.error("Erro ao reagendar:", e);
    }
}

function openQuickScheduleModal(procedure) {
    const name = prompt(
        `Nome do cliente para o procedimento "${procedure.name}":`
    );
    if (!name) return;
    const phone = prompt("Telefone/WhatsApp do cliente:");
    if (!phone) return;

    scheduleNextForCustomer(procedure.id, { name, phone });
}

async function scheduleNextForCustomer(procedureId, customerData) {
    try {
        const customer = await Api.createCustomer(customerData);
        const appt = await Api.scheduleNext({
            customerId: customer.id,
            procedureId,
        });

        alert(
            `Agendado para ${customer.name} em ${formatDateTime(
                appt.startDateTime
            )}`
        );
        loadNextAppointments();
    } catch (e) {
        alert("Erro ao agendar próximo horário.");
        console.error("Erro ao agendar:", e);
    }
}

// Funções de formatação
function formatDateTime(iso) {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d
        .toLocaleTimeString()
        .substring(0, 5)}`;
}

function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString().substring(0, 5);
}

return {
    loadNextAppointments,
    openQuickScheduleModal,
    handleCancel,
    handleReschedule,
};


})();