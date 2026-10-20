const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

function addMsg(text, who) {
    const div = document.createElement('div');
    div.style.padding = '10px';
    div.style.margin = '5px';
    div.style.borderRadius = '10px';
    div.style.maxWidth = '80%';
    div.innerText = text;
    if (who === 'user') {
        div.style.background = '#007bff';
        div.style.color = 'white';
        div.style.alignSelf = 'flex-end';
        div.style.marginLeft = 'auto';
    } else {
        div.style.background = '#222';
        div.style.color = 'white';
    }
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMsg(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        if (data.reply) {
            addMsg(data.reply, 'ai');
        } else {
            addMsg('Error: ' + data.error, 'ai');
        }

    } catch (error) {
        console.log(error);
        addMsg('Network Error bro! Try again', 'ai');
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
});