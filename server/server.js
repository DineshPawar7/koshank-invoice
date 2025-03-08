const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_PASSWORD = process.env.SECRET_PASSWORD

app.post("/api/auth", (req, res) => {
    const { password } = req.body;

    if (password === SECRET_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Incorrect password" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
