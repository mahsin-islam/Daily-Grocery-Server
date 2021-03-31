const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(express.json())
require('dotenv').config()
const port = process.env.PORT || 5000
const dbuser = 'admin';
const dbpass = 'admin123'


const uri = "mongodb+srv://admin:admin123@cluster0.qde61.mongodb.net/grocery?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('database connected')
    const productCollection = client.db("grocery").collection("products");
    const ordersCollection = client.db("grocery").collection("orders");

    app.get('/', (req, res) => {
        res.send('Database is connected!')
    });

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, products) => {
                res.send(products)
            })
    });

    app.get('/product/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.find({ _id: id })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });


    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/orders', (req, res) => {
        const queryEmail = req.query.email
        ordersCollection.find({ userEmail: queryEmail })
            .toArray((err, documents) => {
                res.send(documents)
            })
    });

    app.patch('/update/:id', (req, res) => {
        todocollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { name: req.body.name }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productCollection.deleteOne({ _id: id })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })


});



app.listen(port);