import express from "express";
import session from "express-session";
import { checkAccess } from "./utils/authUtils.js";
import messageRoute from "./routes/messageRoutes.js";
import chatRoute from "./routes/chatRoutes.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoutes.js";

const app = express();

const port = 8000;

// Middleware
app.use(
  session({
    secret: "chathygge",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.set("view engine", "pug");

// Link til css
app.use(express.static("public"));

// JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check access hver gang en URL tilgåes
app.use(checkAccess);

// Routes
app.use("/", messageRoute);
app.use("/", chatRoute);
app.use("/", authRoute);
app.use("/", userRoute);

app.get("/", (req, res) => {
  res.render("homepageView", { isKnownUser: req.session.isLoggedIn });
});

// Server
app.listen(port, () => {
  console.log("Listening on port 8000");
});
