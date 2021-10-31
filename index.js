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




async function run() {
    try {
        await client.connect();
        //console.log('connected to database');
        const database = client.db('hotel');
        const servicesCollection = database.collection('services');
        //GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        //GET SINGLE SERVICE
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting service')
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);

        })
        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);
            const result = await servicesCollection.insertOne(service)

            console.log(result)
            res.json(result)
        });
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleted id')
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
        //UPDATE API
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id)
            const updateOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateOrder.name,
                    email: updateOrder.email,
                    title: updateOrder.title,
                    price: updateOrder.price,
                    description: updateOrder.description,
                    address: updateOrder.address,
                    city: updateOrder.city,
                    date: updateOrder.date,
                    image: updateOrder.image
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options)



            res.json(result)
        })

        // my orders

        app.get("/myOrders/:email", async (req, res) => {
            const result = await servicesCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });


    }
    finally {
        // await client.close();
    }


}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running Genius Server');
});
app.get('/hello', (req, res) => {
    res.send('Hello updated here')
})

app.listen(port, () => {
    console.log("Running Genius Server on port", port)
});


