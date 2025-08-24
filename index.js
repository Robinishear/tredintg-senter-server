const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------- Middleware ----------------
app.use(cors());
app.use(express.json());

// ---------------- MongoDB Setup ----------------
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI missing in .env file!");
  process.exit(1);
}

// Mongo client with Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, usersCollection, productsCollection, ordersCollection, tasksCollection, messagesCollection;

async function connectDB() {
  try {
    await client.connect();

    // Ping test
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. MongoDB connected!");

    // Select database & collections
    db = client.db("treding-app"); 
    usersCollection = db.collection("users");
    productsCollection = db.collection("products");
    ordersCollection = db.collection("orders");
    tasksCollection = db.collection("tasks");
    messagesCollection = db.collection("messages");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

// ---------------- Routes ----------------

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Backend Server Running");
});

// Register new user
app.post("/api/users", async (req, res) => {
  try {
    if (!usersCollection) throw new Error("Database not connected yet");
    const result = await usersCollection.insertOne(req.body);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    if (!usersCollection) throw new Error("Database not connected yet");
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
  });
