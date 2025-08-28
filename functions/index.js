require("dotenv").config();
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./keys/serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import order routes
const orderRoutes = require("./routes/orderRoutes");

// Apply order routes
app.use("/orders", orderRoutes);

exports.api = functions.https.onRequest(app);