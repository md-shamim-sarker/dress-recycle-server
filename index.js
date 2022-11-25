const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Atlas
/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1}); */

// Local
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function run() {
    try {
        const usersCollection = client.db('dressRecycle').collection('users');
        const categoriesCollection = client.db('dressRecycle').collection('categories');
        const productsCollection = client.db('dressRecycle').collection('products');
        const wishListsCollection = client.db('dressRecycle').collection('wishLists');
        const ordersCollection = client.db('dressRecycle').collection('orders');

        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
            console.log('Data added successfully...');
        });

        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        app.post("/wishLists", async (req, res) => {
            const wishList = req.body;
            const result = await wishListsCollection.insertOne(wishList);
            res.send(result);
        });

        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        app.get("/wishLists/:email", async (req, res) => {
            const email = req.params.email;
            const query = {userEmail: email};
            const wishLists = await wishListsCollection.find(query).toArray();
            res.send(wishLists);
        });

        app.get("/products/:email", async (req, res) => {
            const email = req.params.email;
            const query = {sellerEmail: email};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.get("/products", async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.find(query).toArray();
            res.send(user);
        });

        app.get("/categories", async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = {categoryId: id};
            const user = await productsCollection.find(query).toArray();
            res.send(user);
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    reportToAdmin: true
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

    } catch(error) {
        console.log(error.message);
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});