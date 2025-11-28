const AppointmentsUI = (() => {
    const nextListId = "nextAppointments";

    async function loadNextAppointments() {
        const el = document.getElementById(nextListId);
        if (!el) return;
        try {
            const list = await Api.listNextAppointments();
            el.innerHTML = "";
            if (!list.length) {
                el.innerHTML =
                    '<p class="section-subtitle">Nenhum agendamento futuro.</p>';
                return;
            }
            list.forEach((appt) => el.appendChild(createAppointmentCard(appt)));
        } catch (e) {
            el.innerHTML = "<p class=\"section-subtitle\">Erro ao carregar agenda.</p>";
        }
    }

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
            await loadNextAppointments();
        } catch (e) {
            alert("Erro ao cancelar agendamento.");
        }
    }

    async function handleReschedule(id) {
        if (!confirm("Reagendar para o próximo horário disponível?")) return;
        try {
            await Api.rescheduleNext(id);
            await loadNextAppointments();
        } catch (e) {
            alert("Erro ao reagendar.");
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
        }
    }

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
    };
})();
