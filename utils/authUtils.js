import { læsJSON, EJER_FIL } from "./jsonUtils.js";
import bcrypt from "bcrypt";

export async function checkCredentials(username, password) {
  let validate = false;
  let users = læsJSON(EJER_FIL);
  for (const user of users) {
    if (username === user.navn) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) validate = true;
    }
  }
  return validate;
}

export function checkAccess(req, res, next) {
  console.log("Forsøger at få adgang til siden " + req.url);
  if (
    (req.url.includes("/chats") ||
      req.url.includes("/users") ||
      req.url.includes("/profile")) &&
    !req.session.isLoggedIn
  ) {
    res.render("errorView", {
      errorMessage: "Du skal være logget ind for at se denne side",
    });
  } else if (req.url.includes("/users") && !(req.session.authLevel === 3)) {
    res.render("errorView", {
      isKnownUser: req.session.isLoggedIn,
      errorMessage: "Du har ikke adgang til denne side",
    });
  } else {
    next();
  }
}

export function getAuthentificationLevel(username) {
  let authentificationLevel = 1;
  let users = læsJSON(EJER_FIL);
  users.forEach((user) => {
    if (username == user.navn) {
      authentificationLevel = user.niveau;
    }
  });
  return authentificationLevel;
}

export function inputIsBlank(username, password) {
  return username.trim() === "" || password.trim() === "";
}

export function usernameIsValid(username) {
  const userArr = læsJSON(EJER_FIL);
  return (
    userArr.find(
      (b) => b.navn.trim().toLowerCase() === username.trim().toLowerCase()
    ) === undefined
  );
}
