const Api = (() => {
    const defaultHeaders = {
        "Content-Type": "application/json",
    };

    async function get(url) {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`Erro GET ${url}`);
        return resp.json();
    }

    async function post(url, body) {
        const resp = await fetch(url, {
            method: "POST",
            headers: defaultHeaders,
            body: JSON.stringify(body),
        });
        if (!resp.ok) throw new Error(`Erro POST ${url}`);
        return resp.json();
    }

    async function put(url, body) {
        const resp = await fetch(url, {
            method: "PUT",
            headers: defaultHeaders,
            body: JSON.stringify(body),
        });
        if (!resp.ok) throw new Error(`Erro PUT ${url}`);
        return resp.json();
    }

    return {
        listProcedures: () => get("/api/procedures"),
        createProcedure: (data) => post("/api/procedures", data),
        updateProcedure: (id, data) => put(`/api/procedures/${id}`, data),

        createCustomer: (data) => post("/api/customers", data),

        scheduleNext: (data) => post("/api/appointments/next", data),
        cancelAppointment: (id, reason) =>
            post(`/api/appointments/${id}/cancel`, { reason }),
        rescheduleNext: (id) =>
            post(`/api/appointments/${id}/reschedule-next`, {}),
        listNextAppointments: () => get("/api/appointments/next-list"),

        chatAsk: (message) => post("/api/chat/ask", { message }),
    };

    async function deleteRequest(url) {
            const resp = await fetch(url, {
                method: "DELETE",
            });
            if (!resp.ok) throw new Error(`Erro DELETE ${url}`);
            // Retorna um objeto vazio ou true/false, já que 204 (No Content) não tem corpo.
            return true;
        }

        return {
            // ... (funções de Procedimentos existentes) ...
            listProcedures: () => get("/api/procedures"),
            createProcedure: (data) => post("/api/procedures", data),
            updateProcedure: (id, data) => put(`/api/procedures/${id}`, data),
            deleteProcedure: (id) => deleteRequest(`/api/procedures/${id}`), // NOVO

            // --- Funções de Clientes atualizadas ---
            listCustomers: () => get("/api/customers"), // NOVO
            createCustomer: (data) => post("/api/customers", data),
            updateCustomer: (id, data) => put(`/api/customers/${id}`, data), // NOVO
            deleteCustomer: (id) => deleteRequest(`/api/customers/${id}`), // NOVO

            // ... (funções de Agendamentos e Chat existentes) ...
            scheduleNext: (data) => post("/api/appointments/next", data),
            cancelAppointment: (id, reason) =>
                post(`/api/appointments/${id}/cancel`, { reason }),
            rescheduleNext: (id) =>
                post(`/api/appointments/${id}/reschedule-next`, {}),
            listNextAppointments: () => get("/api/appointments/next-list"),
            chatAsk: (message) => post("/api/chat/ask", { message }),
        };
    })();
