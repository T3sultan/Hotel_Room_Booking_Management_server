const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgqch.mongodb.net/
myFirstDatabase?retryWrites=true&w=majority`;
//  console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect((err) => {
    const serviceCollection = client.db("hotel").collection("services");
    const volunteerCollection = client
        .db("hotelRoom")
        .collection("servicesMan");

    //GET API
    app.get('/addNewService', async (req, res) => {
        const cursor = serviceCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
    })
    // add Events
    app.post("/addNewService", async (req, res) => {
        console.log(req.body);
        const result = await serviceCollection.insertOne(req.body);
        console.log(result);
        res.json(result)
    });

    // get search events
    // app.get("/searchEvent", async (req, res) => {
    //   const result = await EventsCollection.find({
    //     title: { $regex: req.query.search },
    //   }).toArray();
    //   res.send(result);
    //   console.log(result);
    // });

    // add volunteer
    // app.post("/addVolunteer", async (req, res) => {
    //   console.log(req.body);
    //   const result = await volunteerCollection.insertOne(req.body);
    //   res.send(result);
    // });

    // get all volunteer

    // app.get("/allVolunteer", async (req, res) => {
    //   const result = await volunteerCollection.find({}).toArray();
    //   res.send(result);
    //   console.log(result);
    // });
    // get all events

    // app.get("/allEvents", async (req, res) => {
    //   const result = await EventsCollection.find({}).toArray();
    //   res.send(result);
    // });

    // delete event

    // app.delete("/deleteEvent/:id", async (req, res) => {
    //   console.log(req.params.id);
    //   const result = await EventsCollection.deleteOne({
    //     _id: ObjectId(req.params.id),
    //   });
    //   res.send(result);
    // });

    // my events

    // app.get("/myEvents/:email", async (req, res) => {
    //   const result = await EventsCollection.find({
    //     email: req.params.email,
    //   }).toArray();
    //   res.send(result);
    // });

    // add addVolunteer

    // get all volunteer
});



app.get('/', (req, res) => {
    res.send('Running Genius Server');
});
app.get('/hello', (req, res) => {
    res.send('Hello updated here')
})

app.listen(port, () => {
    console.log("Running Genius Server on port", port)
});


