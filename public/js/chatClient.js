async function deleteChat(chatId) {
    const confirmDelete = confirm("Er du sikker på at du vil slette denne chat?");
    if (!confirmDelete) return;
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
    const newName = prompt("Nyt navn til chat:").trim();
    if (!newName) return;
    if (newName.length < 3) {
        alert("Navnet er for kort");
        return;
    }
    if (newName.length > 20) {
        alert("Navnet er for langt");
        return;
    }
    if (newName === '') {
        alert("Indtast venligst et navn");
        return;
    }

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

window.filterChats = () => {
    const chatItems = document.querySelectorAll('.chat-item');
    const chatFilter = document.querySelector('#searchFilter').value;
    chatItems.forEach(chatItem => {
        if (chatItem.textContent.toLowerCase().includes(chatFilter.toLowerCase())) {
            chatItem.style.display = 'flex';
        } else {
            chatItem.style.display = 'none';
        }
    });
}

window.deleteChat = deleteChat;
window.updateChat = updateChat;

