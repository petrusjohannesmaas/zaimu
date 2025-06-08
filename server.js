const express = require("express");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

const app = express();
const db = new Database("zaimu.sqlite");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({
    secret: "zaimu-secret",
    resave: false,
    saveUninitialized: true,
}));

// Routes

// Redirect to login if not logged in
app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public/login.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public/register.html")));

app.post("/register", async (req, res) => {
    const { username, password, est_income, savings_goal } = req.body;
    const userExists = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (userExists) return res.status(400).send("Username already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);
    db.prepare("INSERT INTO users (username, password, est_income, savings_goal) VALUES (?, ?, ?, ?)")
        .run(username, hashedPassword, est_income, savings_goal);

    res.redirect("/login");
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Invalid credentials.");
    }

    req.session.username = username;
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    if (!req.session.username) return res.redirect("/login");
    res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/user-info", (req, res) => {
    if (!req.session.username) return res.json({ username: null });

    const user = db.prepare("SELECT username, est_income, savings_goal FROM users WHERE username = ?").get(req.session.username);
    res.json(user);
});

app.post("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
