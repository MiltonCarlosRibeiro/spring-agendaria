// src/main/resources/static/assets/js/customers.js

const CustomersUI = (() => {
    const tableBodyId = "customersTableBody";
    let customerModal;
    let currentCustomerModal;

    function init() {
        customerModal = document.getElementById('customerModal');
        // Inicializa o modal do Bootstrap
        if (customerModal && typeof bootstrap !== 'undefined') {
            currentCustomerModal = new bootstrap.Modal(customerModal);
        }

        // Configura o evento do formulário
        document.getElementById('customerForm')?.addEventListener('submit', handleFormSubmit);
        document.getElementById('btnNovoCliente')?.addEventListener('click', openModalForCreate);
    }

    async function loadCustomers() {
        const el = document.getElementById(tableBodyId);
        if (!el) return;
        el.innerHTML = '<tr><td colspan="4">Carregando clientes...</td></tr>';

        try {
            const list = await Api.listCustomers();
            renderCustomers(list);
        } catch (e) {
            el.innerHTML = '<tr><td colspan="4" class="text-danger">Erro ao carregar clientes.</td></tr>';
        }
    }

    function renderCustomers(list) {
        const el = document.getElementById(tableBodyId);
        el.innerHTML = "";
        if (!list || list.length === 0) {
             el.innerHTML = '<tr><td colspan="4">Nenhum cliente cadastrado.</td></tr>';
             return;
        }

        list.forEach(c => el.appendChild(createCustomerRow(c)));
    }

    function createCustomerRow(customer) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>
                <button class="btn btn-sm btn-outline-info me-2" onclick="CustomersUI.openModalForEdit(${customer.id}, '${customer.name}', '${customer.phone}')">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="CustomersUI.handleDelete(${customer.id}, '${customer.name}')">Deletar</button>
            </td>
        `;
        return tr;
    }

    function openModalForCreate() {
        document.getElementById("customerId").value = '';
        document.getElementById("customerName").value = '';
        document.getElementById("customerPhone").value = '';
        document.getElementById("customerModalLabel").textContent = "Novo Cliente";
        currentCustomerModal?.show();
    }

    function openModalForEdit(id, name, phone) {
        document.getElementById("customerId").value = id;
        document.getElementById("customerName").value = name;
        document.getElementById("customerPhone").value = phone;
        document.getElementById("customerModalLabel").textContent = "Editar Cliente";
        currentCustomerModal?.show();
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const id = document.getElementById("customerId").value;
        const name = document.getElementById("customerName").value;
        const phone = document.getElementById("customerPhone").value;

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
            alert("Erro ao salvar o cliente.");
        }
    }

    async function handleDelete(id, name) {
        if (!confirm(`Deseja realmente deletar o cliente ${name}? Isso pode afetar agendamentos antigos.`)) return;

        try {
            await Api.deleteCustomer(id);
            await loadCustomers();
        } catch (error) {
            alert("Erro ao deletar o cliente.");
        }
    }

    return {
        init,
        loadCustomers,
        openModalForEdit,
        handleDelete,
        // openModalForCreate (usado no HTML)
    };
})();

// Chama a inicialização e o carregamento quando a página de clientes é carregada
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes('customers.html')) {
        CustomersUI.init();
        CustomersUI.loadCustomers();
    }
});