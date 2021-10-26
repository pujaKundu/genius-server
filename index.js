const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzwpo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//check as a beginner
//console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//insert a document
async function run() {
  try {
    await client.connect();
    //console.log("connected to database");
    //create database and collection
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("servicesCollection");
    //GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //GET SINGLE SERVICE
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Hitting id", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    //post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api");
      //insert one
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });
    //DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //await client.close()
  }
}
//function call
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server started");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
