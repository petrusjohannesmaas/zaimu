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

app.get("/settings", (req, res) => {
    if (!req.session.username) return res.redirect("/login");
    res.sendFile(path.join(__dirname, "public/settings.html"));
});

app.post("/update-settings", (req, res) => {
    if (!req.session.username) return res.status(401).send("Unauthorized");

    const { est_income, savings_goal } = req.body;
    db.prepare("UPDATE users SET est_income = ?, savings_goal = ? WHERE username = ?")
        .run(est_income, savings_goal, req.session.username);

    res.redirect("/home");
});

app.post("/add-transaction", (req, res) => {
    if (!req.session.username) return res.status(401).send("Unauthorized");

    const { amount, type, category, description, date } = req.body;
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(req.session.username);

    db.prepare(`
        INSERT INTO transactions (user_id, amount, type, category, description, date)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(user.id, amount, type, category, description, date);

    res.send("Transaction saved!");
});

app.get("/get-transactions", (req, res) => {
    if (!req.session.username) return res.status(401).send("Unauthorized");

    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(req.session.username);
    const transactions = db.prepare("SELECT amount, type, category, description, date FROM transactions WHERE user_id = ? ORDER BY date DESC").all(user.id);

    res.json(transactions);
});

app.get("/metrics", (req, res) => {
    if (!req.session.username) return res.redirect("/login");
    res.sendFile(path.join(__dirname, "public/metrics.html"));
});

app.get("/get-transactions/:month", (req, res) => {
    if (!req.session.username) return res.status(401).send("Unauthorized");

    const { month } = req.params;
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(req.session.username);

    const transactions = db.prepare(`
        SELECT amount, type, category, date FROM transactions 
        WHERE user_id = ? AND strftime('%m', date) = ?
    `).all(user.id, month);

    res.json(transactions);
});


app.listen(3000, () => console.log("Server running at http://localhost:3000"));
