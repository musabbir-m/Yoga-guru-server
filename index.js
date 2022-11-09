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
    //to delete review

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
