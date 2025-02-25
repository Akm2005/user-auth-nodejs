var express = require("express");
var router = express.Router();
const sql = require("mssql");
const dbConfig = require("../config/dbConfig"); // Database Config Import

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user list
 *     description: Returns a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get("/", async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT * FROM users");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err });
    }
});

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Invalid input
 */
router.post("/signup", async (req, res) => {
    const { name, email, phone, username, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const checkUser = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query("SELECT * FROM users WHERE username = @username");

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        await pool
            .request()
            .input("name", sql.NVarChar, name)
            .input("email", sql.NVarChar, email)
            .input("phone", sql.NVarChar, phone)
            .input("username", sql.NVarChar, username)
            .input("password", sql.NVarChar, password)
            .query(
                "INSERT INTO users (name, email, phone, username, password) VALUES (@name, @email, @phone, @username, @password)"
            );

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err });
    }
});

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: User Signin
 *     description: Logs in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid username or password
 */
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool
            .request()
            .input("username", sql.NVarChar, username)
            .query("SELECT * FROM users WHERE username = @username");

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const user = result.recordset[0];

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ message: "Database error", error: err });
    }
});

module.exports = router;
