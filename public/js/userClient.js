async function updatePassword() {
  const oldPassword = document.querySelector("#oldPassword").value;
  const newPassword = document.querySelector("#newPassword").value;
  const repeatPassword = document.querySelector("#repeatPassword").value;

  if (!oldPassword || !newPassword || !repeatPassword) {
    document.querySelector(".error-message").textContent =
      "Indtast venligst alle felter";
    return;
  }

  if (newPassword.length < 8) {
    document.querySelector(".error-message").textContent =
      "Nyt kodeord er for kort";
    return;
  }

  if (newPassword.length > 20) {
    document.querySelector(".error-message").textContent =
      "Nyt kodeord er for langt";
    return;
  }

  if (newPassword === oldPassword) {
    document.querySelector(".error-message").textContent =
      "Nyt kodeord kan ikke være det samme som gamle";
    return;
  }

  if (newPassword !== repeatPassword) {
    document.querySelector(".error-message").textContent =
      "Kodeordene er ikke ens";
    return;
  }

  try {
    const response = await fetch(`/profile/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    if (response.ok) {
      alert("Kodeord opdateret");
      window.location.href = `/profile`;
      console.log(newPassword);
    } else {
      const fejl = await response.text();
      document.querySelector(".error-message").textContent = fejl;
      console.log("Kunne ikke opdatere kodeord:", fejl);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateAuthLevel(userId, authLevel) {
  try {
    const response = await fetch(`/users/${userId}/auth`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authLevel: authLevel,
        id: userId,
      }),
    });

    if (response.ok) {
      alert("Rettigheder opdateret");
      console.log(authLevel);
    } else {
      const fejl = await response.text();
      document.querySelector(".error-message").textContent = fejl;
      console.log("Kunne ikke opdatere rettigheder:", fejl);
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteUser(userId) {
  const confirmDelete = confirm(
    "Er du sikker på at du vil slette denne bruger?"
  );
  if (!confirmDelete) return;
  try {
    const res = await fetch(`/users/${userId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);
    window.location.href = "/users";
  } catch (error) {
    console.error("Fejl ved sletning:" + error);
  }
}

window.updatePassword = updatePassword;
window.updateAuthLevel = updateAuthLevel;
window.deleteUser = deleteUser;
