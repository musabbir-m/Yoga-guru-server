const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.z1jayhr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //collections
    const yogaCollection = client.db("yogaCoach").collection("services");
    const reviewCollection = client.db("yogaCoach").collection("reviews");
    //load 3 services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = yogaCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //load all services
    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = yogaCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //load single service
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await yogaCollection.findOne(query);
      res.send(service);
    });

    //to post review
    app.post("/review", async (req, res) => {
      const order = req.body;
      const result = await reviewCollection.insertOne(order);
      console.log(result);
      res.send(result);
    });

    //to add service

    app.post("/service", async (req, res) => {
      const service = req.body;
      const result = await yogaCollection.insertOne(service);
      console.log(result);
      res.send(result);
    });

    //load single service review with query (service/_id)

    app.get("/reviews", async (req, res) => {
      console.log(req.query.id);
      let query = {};
      if (req.query.id) {
        query = {
          service: req.query.id,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //to get my reviews with email querry
    app.get("/myreviews", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //to delete review

    app.delete("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    //update review

    app.patch("/service/:id", async (req, res) => {
      const id = req.params.id;
      const text = req.body.text;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          reviewText: text,
        },
      };
      const result = await reviewCollection.updateOne(query, updateDoc);
      res.send(result);
      console.log(result);
    });

    //to load review with service id
  } finally {
    //finally
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("yoga server running");
});

app.listen(port, () => {
  console.log(` server running on port: ${port}`);
});
