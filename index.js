const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://turismo-a896b.web.app'],
  credentials: true,
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());

// console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0rd277b.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("turismoDB").collection('users');
    const touristSpotsCollection = client.db("turismoDB").collection('touristspots');
    const addTouristSpot = client.db("turismoDB").collection('addTouristSpot');

    //  
    app.get('/touristspots', async (req, res) => {
       const cursor = touristSpotsCollection.find();
       const result = await cursor.toArray();
       res.send(result);
    })
    
    app.get('/touristspots/:id', async(req, res)=> {
      const id= req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await touristSpotsCollection.findOne(query);
      res.send(result);
    })

    // add Tourist Spot
    app.post('/addtouristspot', async(req, res)=> {
       const addSpot = req.body;
       const result = await addTouristSpot.insertOne(addSpot);
       res.send(result);
    })

    // mylist
    app.get('/addtouristspot', async(req, res)=> {
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addTouristSpot.find(query).toArray();
      res.send(result);
    })

    // mylist update
    app.patch('/addtouristspot/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await addTouristSpot.findOne(query);
      res.send(user)
    })

    // get all tourist spot
    app.get('/alltouristspot', async(req, res)=> {
      const cursor = addTouristSpot.find();
      const result = await cursor.toArray();
      res.send(result);
    })





    // User creation through register
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("tursimo is running");
})

app.listen(port, () => {
  console.log(`port is running on ${port} `)
})
