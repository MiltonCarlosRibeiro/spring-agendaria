document.addEventListener("DOMContentLoaded", () => {
    highlightActiveNav();
    setupFooterYear();

    ProceduresUI.loadFeaturedProcedures();
    AppointmentsUI.loadNextAppointments();

    ProceduresUI.loadProceduresIntoGrid();
    ProceduresUI.setupProcedureModal();

    if (document.getElementById("chatWidget")) {
        ChatWidget.init();
    }

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

function highlightActiveNav() {
    const links = document.querySelectorAll(".nav-link");
    const path = window.location.pathname;

    links.forEach((link) => {
        link.classList.remove("active");
        if (path === "/" && link.getAttribute("data-page") === "home") {
            link.classList.add("active");
        } else if (path.includes("sobre") && link.getAttribute("data-page") === "sobre") {
            link.classList.add("active");
        } else if (path.includes("produtos") && link.getAttribute("data-page") === "produtos") {
            link.classList.add("active");
        }
    });
}

function setupFooterYear() {
    const span = document.getElementById("yearFooter");
    if (span) {
        span.textContent = new Date().getFullYear();
    }
}
