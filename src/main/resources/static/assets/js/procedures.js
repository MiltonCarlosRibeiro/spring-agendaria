const ProceduresUI = (() => {
    const gridId = "proceduresGrid";
    const featuredId = "featuredProcedures";

    async function loadProceduresIntoGrid() {
        const el = document.getElementById(gridId);
        if (!el) return;

        try {
            const procedures = await Api.listProcedures();
            el.innerHTML = "";
            procedures.forEach((p) => el.appendChild(createProcedureCard(p, true)));
        } catch (e) {
            el.innerHTML = `<p class="section-subtitle">Erro ao carregar procedimentos.</p>`;
        }
    }

    async function loadFeaturedProcedures() {
        const el = document.getElementById(featuredId);
        if (!el) return;

        try {
            const procedures = await Api.listProcedures();
            el.innerHTML = "";
            procedures.slice(0, 4).forEach((p) => {
                el.appendChild(createProcedureCard(p, false));
            });
        } catch (e) {
            el.innerHTML = `<p class="section-subtitle">Nenhum procedimento encontrado.</p>`;
        }
    }

    function createProcedureCard(procedure, showActions) {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("div");
        title.className = "card-title";
        title.textContent = procedure.name;

        const subtitle = document.createElement("div");
        subtitle.className = "card-subtitle";
        subtitle.textContent = `Duração: ${procedure.durationMinutes} min`;

        const meta = document.createElement("div");
        meta.className = "card-meta";
        const price = document.createElement("span");
        price.textContent = `R$ ${Number(procedure.price).toFixed(2)}`;
        meta.appendChild(price);

        const status = document.createElement("span");
        status.textContent = procedure.active ? "Ativo" : "Inativo";
        status.style.color = procedure.active ? "#4ade80" : "#f97316";
        meta.appendChild(status);

        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(meta);

        if (showActions) {
            const actions = document.createElement("div");
            actions.className = "form-actions";

            const btnAgendar = document.createElement("button");
            btnAgendar.className = "btn btn-primary";
            btnAgendar.textContent = "Agendar";
            btnAgendar.onclick = () =>
                AppointmentsUI.openQuickScheduleModal(procedure);

            const btnEditar = document.createElement("button");
            btnEditar.className = "btn btn-outline";
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () =>
                openProcedureModalForEdit(procedure);

            actions.appendChild(btnAgendar);
            actions.appendChild(btnEditar);
            card.appendChild(actions);
        } else {
            const actions = document.createElement("div");
            actions.className = "form-actions";
            const btnAgendar = document.createElement("button");
            btnAgendar.className = "btn btn-primary";
            btnAgendar.textContent = "Agendar agora";
            btnAgendar.onclick = () =>
                AppointmentsUI.openQuickScheduleModal(procedure);
            actions.appendChild(btnAgendar);
            card.appendChild(actions);
        }

        return card;
    }

    function setupProcedureModal() {
        const btnNew = document.getElementById("btnNovoProcedimento");
        const modal = document.getElementById("procedureModal");
        const closeBtn = document.getElementById("procedureModalClose");
        const cancelBtn = document.getElementById("procedureCancelBtn");
        const form = document.getElementById("procedureForm");

        if (!btnNew || !modal || !form) return;

        function openModal() {
            modal.classList.remove("hidden");
            document.getElementById("procedureModalTitle").textContent =
                "Novo procedimento";
            form.reset();
            document.getElementById("procedureId").value = "";
            document.getElementById("procedureActive").checked = true;
        }

        function closeModal() {
            modal.classList.add("hidden");
        }

        btnNew.addEventListener("click", openModal);
        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const id = document.getElementById("procedureId").value || null;
            const payload = {
                name: document.getElementById("procedureName").value,
                durationMinutes: Number(
                    document.getElementById("procedureDuration").value
                ),
                price: Number(document.getElementById("procedurePrice").value),
                active: document.getElementById("procedureActive").checked,
            };
            try {
                if (id) {
                    await Api.updateProcedure(id, payload);
                } else {
                    await Api.createProcedure(payload);
                }
                closeModal();
                loadProceduresIntoGrid();
            } catch (err) {
                alert("Erro ao salvar procedimento.");
            }
        });
    }

    function openProcedureModalForEdit(procedure) {
        const modal = document.getElementById("procedureModal");
        const form = document.getElementById("procedureForm");
        if (!modal || !form) return;

        modal.classList.remove("hidden");
        document.getElementById("procedureModalTitle").textContent =
            "Editar procedimento";

        document.getElementById("procedureId").value = procedure.id;
        document.getElementById("procedureName").value = procedure.name;
        document.getElementById("procedureDuration").value =
            procedure.durationMinutes;
        document.getElementById("procedurePrice").value = procedure.price;
        document.getElementById("procedureActive").checked = procedure.active;
    }

    return {
        loadProceduresIntoGrid,
        loadFeaturedProcedures,
        setupProcedureModal,
        openProcedureModalForEdit,
    };

// Adicionar a funcionalidade de deletar no createProcedureCard
function createProcedureCard(procedure, showActions) {
    // ... (criação do card) ...

    if (showActions) {
        // ... (criação de btnAgendar e btnEditar) ...

        // --- NOVO: Botão Deletar ---
        const btnDeletar = document.createElement("button");
        btnDeletar.className = "btn btn-outline-danger mt-2"; // Use mt-2 para espaçamento
        btnDeletar.textContent = "Deletar";
        btnDeletar.onclick = () =>
            handleDelete(procedure.id, procedure.name); // NOVO HANDLER

        actions.appendChild(btnAgendar);
        actions.appendChild(btnEditar);
        actions.appendChild(btnDeletar); // Adicionar o novo botão
        card.appendChild(actions);
    // ... (restante do código)
}

// --- NOVO HANDLER: Deletar Procedimento ---
async function handleDelete(id, name) {
    if (!confirm(`Deseja realmente deletar o procedimento ${name}? Isso pode afetar a agenda.`)) return;

    try {
        await Api.deleteProcedure(id);
        alert(`Procedimento ${name} deletado com sucesso.`);
        loadProceduresIntoGrid(); // Recarrega a lista
    } catch (e) {
        alert("Erro ao deletar o procedimento.");
    }
}

// ... (Restante do código ProceduresUI) ...

return {
    loadProceduresIntoGrid,
    loadFeaturedProcedures,
    setupProcedureModal,
    openProcedureModalForEdit,
    // handleDelete // Não precisa expor, é interno.
};
})();
