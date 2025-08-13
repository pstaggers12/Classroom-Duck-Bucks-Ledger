const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

//Serve static files
app.use(express.static("public"));
app.use(bodyParser.json());

//Database setup
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error(err.message);
    console.log("Connected to SQLite database.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS ledger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    familyName TEXT,
    childName TEXT,
    category TEXT,
    activity TEXT,
    bucks INTEGER
    )
    `);

    //Add entry
    app.post("/add", (req, res) => {
        const { date, familyName, childName, category, activity, bucks } = req.body;
        db.run(
            `INSERT INTO ledger (date, familyName, childName, category, activity, bucks) VALUES (?, ?, ?, ?, ?, ?)`,
            [date, familyName, childName, category, activity, bucks],
            function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID });
            }
        );
    });

    //Get all entries
    app.get("/entries", (req, res) => {
        db.all(`SELECT * FROM ledger ORDER BY date DESC`, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    //Start server
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });