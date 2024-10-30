const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const EmployeeModel = require("./model/Employee");
const overtimeRoutes = require("./routes/overtimeRoutes");
const leaveRoutes = require('./routes/leaveRoutes');
const benefitsRoutes = require("./routes/benefitsRoutes");
const incentivesRoutes = require('./routes/incentivesRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
require('dotenv').config(); // Import dotenv to read .env file

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URL); // Use environment variable for MongoDB URI

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable for JWT secret
const PORT = process.env.PORT || 8055; // Use environment variable for port

// Middleware 
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; 
    if (!token) {
        return res.sendStatus(403); 
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.user = user; // Save user info in request
        next();
    });
};

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await EmployeeModel.findOne({ email });
        if (!user) {
            return res.status(404).json("No record existed");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json("The password is incorrect");
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Success", token });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Registration Route
app.post("/register", async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user already exists
        const existingUser = await EmployeeModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json("Email already in use");
        }

        const employee = await EmployeeModel.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(500).json(err);
    }
});


app.get("/protected", authenticateJWT, (req, res) => {
    res.json("This is a protected route");
});

app.use("/overtimes", overtimeRoutes);

app.use('/leaves', leaveRoutes);

app.use('/incentives', incentivesRoutes);

app.use('/benefits', benefitsRoutes);

app.use('/shifts', shiftRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


