document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNav();
    setupFooterYear();

    // Lógica de carregamento condicional baseada na URL
    const path = window.location.pathname;

    // --- CARREGAMENTO GLOBAL ---
    if (document.getElementById("chatWidget")) {
        ChatWidget.init();
    }

    // --- LÓGICA DA HOME PAGE (index.html) ---
    // A home page precisa dos cards em destaque e dos próximos agendamentos (em formato de card)
    if (path === "/" || path.includes("/index.html")) {
        // As funções de carregamento na Home (index.html)
        ProceduresUI.loadFeaturedProcedures();
        AppointmentsUI.loadNextAppointments(); // Carrega lista de cards na Home
    }

    // --- LÓGICA DA PÁGINA DE PROCEDIMENTOS (produtos.html) ---
    if (path.includes("produtos.html")) {
        ProceduresUI.loadProceduresIntoGrid(); // Carrega a grade completa
        ProceduresUI.setupProcedureModal();    // Inicializa o modal de CRUD
    }

    // --- LÓGICA DA NOVA PÁGINA DE CLIENTES (customers.html) ---
    // Note: CustomersUI.init() e loadCustomers() são chamados aqui.
    if (path.includes("customers.html") && typeof CustomersUI !== 'undefined') {
        CustomersUI.init();
        CustomersUI.loadCustomers();
    }

    // --- LÓGICA DA NOVA PÁGINA DE AGENDA (appointments.html) ---
    // Note: loadNextAppointments() aqui usará o modo de Tabela (ver appointments.js)
    if (path.includes("appointments.html")) {
        AppointmentsUI.loadNextAppointments();
    }

    // --- AÇÕES DE BOTÃO NA HOME PAGE ---
    const btnVerProcedimentos = document.getElementById("btnVerProcedimentos");
    if (btnVerProcedimentos) {
        btnVerProcedimentos.addEventListener("click", () => {
            window.location.href = "/produtos.html";
        });
    }

    const btnAgendarAgora = document.getElementById("btnAgendarAgora");
    if (btnAgendarAgora) {
        btnAgendarAgora.addEventListener("click", () => {
            window.location.href = "/produtos.html";
        });
    }
});

/**
 * Destaca o link de navegação ativo baseado na URL atual.
 */
function highlightActiveNav() {
    const links = document.querySelectorAll(".nav-link");
    const path = window.location.pathname;

    links.forEach((link) => {
        link.classList.remove("active");

        const dataPage = link.getAttribute("data-page");

        if (dataPage === "home" && (path === "/" || path.includes("/index.html"))) {
            link.classList.add("active");
        } else if (dataPage === "sobre" && path.includes("sobre.html")) {
            link.classList.add("active");
        } else if (dataPage === "produtos" && path.includes("produtos.html")) {
            link.classList.add("active");
        } else if (dataPage === "appointments" && path.includes("appointments.html")) {
            link.classList.add("active");
        } else if (dataPage === "customers" && path.includes("customers.html")) {
            link.classList.add("active");
        }
    });
}

/**
 * Define o ano atual no footer.
 */
function setupFooterYear() {
    const span = document.getElementById("yearFooter");
    if (span) {
        span.textContent = new Date().getFullYear();
    }
}