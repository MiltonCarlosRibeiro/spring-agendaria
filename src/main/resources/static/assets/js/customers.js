// Lógica de UI para o CRUD de Clientes, utilizando Bootstrap Modal e a API
const CustomersUI = (() => {
const tableBodyId = "customersTableBody";
const modalId = "customerModal";

let currentCustomerModal;

/**
 * Inicializa o modal do Bootstrap e configura listeners do formulário.
 */
function init() {
    if (typeof bootstrap === 'undefined') {
        console.error("Bootstrap JS não está carregado. A funcionalidade do modal pode falhar.");
        return;
    }

    const customerModalEl = document.getElementById(modalId);
    if (customerModalEl) {
        currentCustomerModal = new bootstrap.Modal(customerModalEl);
    }

    document.getElementById('customerForm')?.addEventListener('submit', handleFormSubmit);
    document.getElementById('btnNovoCliente')?.addEventListener('click', openModalForCreate);
}

/**
 * Carrega a lista de clientes da API e renderiza na tabela.
 */
async function loadCustomers() {
    const el = document.getElementById(tableBodyId);
    if (!el) return;

    el.innerHTML = '<tr><td colspan="4">Carregando clientes...</td></tr>';

    try {
        const list = await Api.listCustomers();
        renderCustomers(list);
    } catch (e) {
        el.innerHTML = '<tr><td colspan="4" class="text-danger">Erro ao carregar clientes. Verifique o console.</td></tr>';
        console.error("Erro ao carregar clientes:", e);
    }
}

/**
 * Renderiza a lista de clientes na tabela.
 */
function renderCustomers(list) {
    const el = document.getElementById(tableBodyId);
    el.innerHTML = "";

    if (!list || list.length === 0) {
         el.innerHTML = '<tr><td colspan="4" class="table-info">Nenhum cliente cadastrado.</td></tr>';
         return;
    }

    list.forEach(c => el.appendChild(createCustomerRow(c)));
}

/**
 * Cria uma linha de tabela (<tr>) para um cliente.
 */
function createCustomerRow(customer) {
    const tr = document.createElement('tr');
    // Sanitiza a string para passar como argumento na função onclick
    const escapedName = customer.name.replace(/'/g, "\\'");

    tr.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>
        <td>${customer.phone}</td>
        <td class="text-center">
            <button class="btn btn-sm btn-outline-info me-2"
                    onclick="CustomersUI.openModalForEdit(${customer.id}, '${escapedName}', '${customer.phone}')">
                Editar
            </button>
            <button class="btn btn-sm btn-danger"
                    onclick="CustomersUI.handleDelete(${customer.id}, '${escapedName}')">
                Deletar
            </button>
        </td>
    `;
    return tr;
}

/**
 * Abre o modal no modo de criação.
 */
function openModalForCreate() {
    document.getElementById("customerId").value = '';
    document.getElementById("customerName").value = '';
    document.getElementById("customerPhone").value = '';
    document.getElementById("customerModalLabel").textContent = "Novo Cliente";
    currentCustomerModal?.show();
}

/**
 * Abre o modal no modo de edição, preenchendo os campos.
 */
function openModalForEdit(id, name, phone) {
    document.getElementById("customerId").value = id;
    document.getElementById("customerName").value = name;
    document.getElementById("customerPhone").value = phone;
    document.getElementById("customerModalLabel").textContent = "Editar Cliente";
    currentCustomerModal?.show();
}

/**
 * Lida com a submissão do formulário (Criação ou Edição).
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("customerId").value;
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;

    if (!name || !phone) return;

    const payload = { name, phone };

    try {
        if (id) {
            await Api.updateCustomer(id, payload);
        } else {
            await Api.createCustomer(payload);
        }

        currentCustomerModal?.hide();
        await loadCustomers();
    } catch (error) {
        alert("Erro ao salvar o cliente. Verifique a conexão com a API.");
        console.error("Erro ao salvar cliente:", error);
    }
}

/**
 * Lida com a deleção de um cliente.
 */
async function handleDelete(id, name) {
    if (!confirm(`Deseja realmente deletar o cliente ${name}? Isso pode afetar agendamentos vinculados.`)) return;

    try {
        await Api.deleteCustomer(id);
        await loadCustomers();
    } catch (error) {
        alert("Erro ao deletar o cliente. Certifique-se de que não há agendamentos ativos vinculados.");
        console.error("Erro ao deletar cliente:", error);
    }
}

return {
    init,
    loadCustomers,
    openModalForEdit,
    handleDelete,
};


})();

// Chama a inicialização e o carregamento quando a página de clientes é carregada
document.addEventListener("DOMContentLoaded", () => {
// customers.js precisa ser carregado antes de customers.html
if (window.location.pathname.includes('customers.html')) {
// CustomersUI.init() é chamado aqui no main.js, mas o fallback é útil
if (typeof CustomersUI !== 'undefined') {
CustomersUI.init();
CustomersUI.loadCustomers();
}
}
});