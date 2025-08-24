const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB setup
const uri = process.env.MONGODB_URI;
let client;

if (!uri) {
  console.error("❌ MONGODB_URI missing in .env file!");
  process.exit(1);
}

try {
  client = new MongoClient(uri);
} catch (err) {
  console.error("❌ Invalid MongoDB URI:", err);
}

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend Server Running (MongoDB may connect later)");
});

// Start server immediately
app.listen(PORT, () => {
  console.log(`🚀---ok ok ok  Server running on port ${PORT}`);
});

// Async function to connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");

    const db = client.db("myDatabase");

 // ------------------- Collections ------------------

    const usersCollection = db.collection("users");
    const productsCollection = db.collection("products");
    const ordersCollection = db.collection("orders");
    const tasksCollection = db.collection("tasks");
    const messagesCollection = db.collection("messages");

    // ------------------- ROUTES -------------------

    app.get("/users", async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.json(users);
    });

    app.get("/products", async (req, res) => {
      const products = await productsCollection.find().toArray();
      res.json(products);
    });

    app.get("/orders", async (req, res) => {
      const orders = await ordersCollection.find().toArray();
      res.json(orders);
    });

    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find().toArray();
      res.json(tasks);
    });

    app.get("/messages", async (req, res) => {
      const messages = await messagesCollection.find().toArray();
      res.json(messages);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

// Call MongoDB connect
connectDB();
// treding-app