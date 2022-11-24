const express = require('express');
const {MongoClient, ServerApiVersion} = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

// Local
// const uri = '';
// const client = new MongoClient(uri);

async function run() {
    try {
        const usersCollection = client.db('dressRecycle').collection('users');
        const categoriesCollection = client.db('dressRecycle').collection('categories');

        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
            console.log('Data added successfully...');
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