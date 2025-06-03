const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});