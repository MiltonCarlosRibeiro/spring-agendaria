// Lógica de UI para Procedimentos, usando Bootstrap Modal + API
const ProceduresUI = (() => {
    const gridId = "proceduresGrid";
    const featuredId = "featuredProcedures";
    const modalId = "procedureModal";

    let currentProcedureModal = null;

    // Inicializa modal + listeners
    function setupProcedureModal() {
        const modalEl = document.getElementById(modalId);
        const form = document.getElementById("procedureForm");
        const btnNew = document.getElementById("btnNovoProcedimento");

        if (!modalEl || !form || !btnNew) {
            console.warn(
                "Elementos do modal de procedimento não encontrados. Verifique IDs em produtos.html."
            );
            return;
        }

        if (typeof bootstrap !== "undefined") {
            currentProcedureModal = new bootstrap.Modal(modalEl);
        } else {
            console.error(
                "Bootstrap JS não está carregado. O modal de procedimentos pode não funcionar corretamente."
            );
        }

        // Abrir modal para criar
        btnNew.addEventListener("click", () => {
            openProcedureModalForCreate();
        });

        // Submit do formulário (create/update)
        form.addEventListener("submit", handleFormSubmit);
    }

    // Carrega procedimentos e renderiza na página de produtos.html
    async function loadProceduresIntoGrid() {
        const container = document.getElementById(gridId);
        if (!container) return;

        container.innerHTML = "<p>Carregando procedimentos...</p>";

        try {
            const procedures = await Api.listProcedures();

            container.innerHTML = "";

            if (!procedures || procedures.length === 0) {
                container.innerHTML =
                    "<p class='section-subtitle'>Nenhum procedimento cadastrado.</p>";
                return;
            }

            procedures.forEach((p) => {
                container.appendChild(createProcedureCard(p));
            });
        } catch (e) {
            console.error("Erro ao carregar procedimentos:", e);
            container.innerHTML =
                "<p class='section-subtitle text-danger'>Erro ao carregar procedimentos. Verifique o console.</p>";
        }
    }

    // Carrega procedimentos em destaque na home (index.html)
    async function loadFeaturedProcedures() {
        const container = document.getElementById(featuredId);
        if (!container) return;

        container.innerHTML = "<p>Carregando procedimentos...</p>";

        try {
            const procedures = await Api.listProcedures();

            container.innerHTML = "";

            if (!procedures || procedures.length === 0) {
                container.innerHTML =
                    "<p class='section-subtitle'>Cadastre procedimentos para começar a agendar.</p>";
                return;
            }

            procedures
                .filter((p) => p.active)
                .forEach((p) => container.appendChild(createFeaturedCard(p)));
        } catch (e) {
            console.error("Erro ao carregar procedimentos em destaque:", e);
            container.innerHTML =
                "<p class='section-subtitle text-danger'>Erro ao carregar procedimentos.</p>";
        }
    }

    // Card usado em produtos.html
    function createProcedureCard(procedure) {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("div");
        title.className = "card-title";
        title.textContent = procedure.name;

        const subtitle = document.createElement("div");
        subtitle.className = "card-subtitle";
        subtitle.textContent = `Duração: ${procedure.durationMinutes} min • R$ ${procedure.price.toFixed(
            2
        )}`;

        const meta = document.createElement("div");
        meta.className = "card-meta";
        meta.textContent = procedure.active ? "Ativo na agenda" : "Inativo";

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-outline";
        btnEdit.textContent = "Editar";
        btnEdit.onclick = () => openProcedureModalForEdit(procedure);

        const btnDelete = document.createElement("button");
        btnDelete.className = "btn btn-outline-danger";
        btnDelete.textContent = "Excluir";
        btnDelete.onclick = () => handleDelete(procedure.id, procedure.name);

        const btnSchedule = document.createElement("button");
        btnSchedule.className = "btn btn-primary";
        btnSchedule.textContent = "Agendar agora";
        btnSchedule.onclick = () => {
            if (window.AppointmentsUI && AppointmentsUI.openQuickScheduleModal) {
                AppointmentsUI.openQuickScheduleModal(procedure);
            } else {
                alert(
                    "Função de agendar rápido não está disponível nesta página."
                );
            }
        };

        actions.appendChild(btnEdit);
        actions.appendChild(btnDelete);
        actions.appendChild(btnSchedule);

        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(meta);
        card.appendChild(actions);

        return card;
    }

    // Card em destaque na home (index.html)
    function createFeaturedCard(procedure) {
        const card = document.createElement("div");
        card.className = "card card-hover";

        const title = document.createElement("div");
        title.className = "card-title";
        title.textContent = procedure.name;

        const subtitle = document.createElement("div");
        subtitle.className = "card-subtitle";
        subtitle.textContent = `Duração: ${procedure.durationMinutes} min • R$ ${procedure.price.toFixed(
            2
        )}`;

        const actions = document.createElement("div");
        actions.className = "card-actions";

        const btnSchedule = document.createElement("button");
        btnSchedule.className = "btn btn-primary";
        btnSchedule.textContent = "Agendar agora";
        btnSchedule.onclick = () => {
            if (window.AppointmentsUI && AppointmentsUI.openQuickScheduleModal) {
                AppointmentsUI.openQuickScheduleModal(procedure);
            } else {
                alert(
                    "Função de agendar rápido não está disponível nesta página."
                );
            }
        };

        actions.appendChild(btnSchedule);

        card.appendChild(title);
        card.appendChild(subtitle);
        card.appendChild(actions);

        return card;
    }

    // Abre modal para CRIAR
    function openProcedureModalForCreate() {
        const idEl = document.getElementById("procedureId");
        const nameEl = document.getElementById("procedureName");
        const durationEl = document.getElementById("procedureDuration");
        const priceEl = document.getElementById("procedurePrice");
        const activeEl = document.getElementById("procedureActive");
        const titleEl = document.getElementById("procedureModalTitle");

        if (!idEl || !nameEl || !durationEl || !priceEl || !activeEl || !titleEl) {
            console.warn(
                "Campos do formulário de procedimento não encontrados. Verifique IDs em produtos.html."
            );
            return;
        }

        idEl.value = "";
        nameEl.value = "";
        durationEl.value = "30";
        priceEl.value = "";
        activeEl.checked = true;
        titleEl.textContent = "Novo procedimento";

        showModal();
    }

    // Abre modal para EDITAR
    function openProcedureModalForEdit(procedure) {
        const idEl = document.getElementById("procedureId");
        const nameEl = document.getElementById("procedureName");
        const durationEl = document.getElementById("procedureDuration");
        const priceEl = document.getElementById("procedurePrice");
        const activeEl = document.getElementById("procedureActive");
        const titleEl = document.getElementById("procedureModalTitle");

        if (!idEl || !nameEl || !durationEl || !priceEl || !activeEl || !titleEl) {
            console.warn(
                "Campos do formulário de procedimento não encontrados. Verifique IDs em produtos.html."
            );
            return;
        }

        idEl.value = procedure.id;
        nameEl.value = procedure.name;
        durationEl.value = procedure.durationMinutes;
        priceEl.value = procedure.price.toFixed(2);
        activeEl.checked = procedure.active;
        titleEl.textContent = "Editar procedimento";

        showModal();
    }

    // Submit do formulário (create/update)
    async function handleFormSubmit(event) {
        event.preventDefault();

        const id = document.getElementById("procedureId").value;
        const name = document.getElementById("procedureName").value.trim();
        const duration = parseInt(
            document.getElementById("procedureDuration").value,
            10
        );
        const price = parseFloat(
            document.getElementById("procedurePrice").value.replace(",", ".")
        );
        const active = document.getElementById("procedureActive").checked;

        if (!name || isNaN(duration) || isNaN(price)) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        const payload = {
            name,
            durationMinutes: duration,
            price,
            active,
        };

        try {
            if (id) {
                payload.id = parseInt(id, 10);
            }

            await Api.saveProcedure(payload);
            hideModal();
            await loadProceduresIntoGrid();
            alert("Procedimento salvo com sucesso!");
        } catch (e) {
            console.error("Erro ao salvar procedimento:", e);
            alert("Erro ao salvar procedimento. Veja o console para mais detalhes.");
        }
    }

    // Deletar procedimento
    async function handleDelete(id, name) {
        if (!confirm(`Deseja realmente excluir o procedimento "${name}"?`)) return;

        try {
            await Api.deleteProcedure(id);
            await loadProceduresIntoGrid();
            alert("Procedimento excluído com sucesso!");
        } catch (e) {
            console.error("Erro ao excluir procedimento:", e);
            alert("Erro ao excluir procedimento. Veja o console para mais detalhes.");
        }
    }

    // Helpers para mostrar/esconder modal
    function showModal() {
        if (currentProcedureModal) {
            currentProcedureModal.show();
        } else {
            const modalEl = document.getElementById(modalId);
            if (modalEl) {
                modalEl.classList.add("show");
                modalEl.style.display = "block";
            }
        }
    }

    function hideModal() {
        if (currentProcedureModal) {
            currentProcedureModal.hide();
        } else {
            const modalEl = document.getElementById(modalId);
            if (modalEl) {
                modalEl.classList.remove("show");
                modalEl.style.display = "none";
            }
        }
    }

    return {
        loadProceduresIntoGrid,
        loadFeaturedProcedures,
        setupProcedureModal,
        openProcedureModalForEdit,
        handleDelete,
    };
})();
