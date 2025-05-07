async function deleteChat(chatId) {
    try {
        const res = await fetch(`/chats/${chatId}/delete`, {
            method: 'DELETE'
        });

        const data = await res.json();
        console.log(data);

        window.location.reload();
    } catch (error) {
        console.error('Fejl ved sletning:', error);
    }
}
async function updateChat(chatId) {
    const newName = prompt("Nyt navn til chat:");
    if (!newName) return;

    try {
        const res = await fetch(`/chats/${chatId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        });

        if (!res.ok) throw new Error("Fejl ved opdatering");

        const data = await res.json();
        console.log(data);
        window.location.reload();

    } catch (err) {
        console.error("Fejl ved opdatering:", err);
    }
}

window.deleteChat = deleteChat;
window.updateChat = updateChat;

