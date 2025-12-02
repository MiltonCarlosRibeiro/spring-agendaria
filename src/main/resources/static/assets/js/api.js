const Api = (() => {
const defaultHeaders = {
"Content-Type": "application/json",
};

/**
 * Requisição GET genérica.
 */
async function get(url) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Erro GET ${url} (${resp.status})`);
    return resp.json();
}

/**
 * Requisição POST genérica (Criação).
 */
async function post(url, body) {
    const resp = await fetch(url, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`Erro POST ${url} (${resp.status})`);
    try { return resp.json(); } catch { return {}; }
}

/**
 * Requisição PUT genérica (Atualização).
 */
async function put(url, body) {
    const resp = await fetch(url, {
        method: "PUT",
        headers: defaultHeaders,
        body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`Erro PUT ${url} (${resp.status})`);
    try { return resp.json(); } catch { return {}; }
}

/**
 * Requisição DELETE genérica.
 */
async function deleteRequest(url) {
    const resp = await fetch(url, {
        method: "DELETE",
    });
    // 204 (No Content) é o código de sucesso esperado para DELETE
    if (!resp.ok && resp.status !== 204) {
        throw new Error(`Erro DELETE ${url} (${resp.status})`);
    }
    return true;
}

return {
    // --- PROCEDIMENTOS (CRUD Completo) ---
    listProcedures: () => get("/api/procedures"),
    createProcedure: (data) => post("/api/procedures", data),
    updateProcedure: (id, data) => put(`/api/procedures/${id}`, data),
    deleteProcedure: (id) => deleteRequest(`/api/procedures/${id}`),

    // --- CLIENTES (CRUD Completo) ---
    listCustomers: () => get("/api/customers"),
    createCustomer: (data) => post("/api/customers", data),
    updateCustomer: (id, data) => put(`/api/customers/${id}`, data),
    deleteCustomer: (id) => deleteRequest(`/api/customers/${id}`),

    // --- AGENDAMENTOS ---
    scheduleNext: (data) => post("/api/appointments/next", data),
    cancelAppointment: (id, reason) =>
        post(`/api/appointments/${id}/cancel`, { reason }),
    rescheduleNext: (id) =>
        post(`/api/appointments/${id}/reschedule-next`, {}),
    listNextAppointments: () => get("/api/appointments/next-list"),

    // --- CHAT ---
    chatAsk: (message) => post("/api/chat/ask", { message }),
};


})();