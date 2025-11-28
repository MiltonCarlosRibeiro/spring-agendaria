const ChatWidget = (() => {
    let messagesEl, inputEl, windowEl, bubbleEl, closeBtn, sendBtn;

    function init() {
        messagesEl = document.getElementById("chatMessages");
        inputEl = document.getElementById("chatInput");
        windowEl = document.getElementById("chatWindow");
        bubbleEl = document.getElementById("chatBubble");
        closeBtn = document.getElementById("chatCloseBtn");
        sendBtn = document.getElementById("chatSendBtn");

        if (!messagesEl || !bubbleEl) return;

        bubbleEl.addEventListener("click", open);
        closeBtn.addEventListener("click", close);
        sendBtn.addEventListener("click", sendMessage);
        inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") sendMessage();
        });

        addBotMessage(
            "Olá! Sou o assistente de agendamentos. Pergunte por um horário, por exemplo: 'Teria horário para sobrancelha?'"
        );
    }

    function open() {
        windowEl.classList.remove("hidden");
    }

    function close() {
        windowEl.classList.add("hidden");
    }

    function addUserMessage(text) {
        const div = document.createElement("div");
        div.className = "chat-message user";
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addBotMessage(text) {
        const div = document.createElement("div");
        div.className = "chat-message bot";
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text) return;
        addUserMessage(text);
        inputEl.value = "";

        try {
            const res = await Api.chatAsk(text);
            addBotMessage(res.answer || "Não entendi, tente reformular a frase.");
        } catch (e) {
            addBotMessage("Não consegui responder agora. Tente mais tarde.");
        }
    }

    return {
        init,
    };
})();
