async function updateMessage(id, chatId) {
    const besked = document.getElementById('beskedInput').value.trim();

    if (!besked) {
        alert("Besked må ikke være tom");
        return;
    }

    try {
        const response = await fetch(`/chats/messages/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ besked })
        });

        if (response.ok) {
            window.location.href = `/chats/${chatId}/messages`;
            console.log(besked);
        } else {
            const fejl = await response.text();
            console.log(fejl);
        }
    } catch (err) {
        console.log(err.message);
    }
}

async function deleteMessage(id, chatId) {
    const confirmDelete = confirm("Vil du slette beskeden?")
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`/chats/messages/${id}`, {
            method: "DELETE"

        })

        if (response.ok) {
            window.location.href = `/chats/${chatId}/messages`;
        } else {
            const fejl = await response.text()
            console.log(fejl);
        }
    } catch (error) {
        console.log(error);
    }
}
