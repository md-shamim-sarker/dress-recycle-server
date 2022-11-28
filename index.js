const express = require('express');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

/* function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send({message: 'Unauthorized Access'});
    }
    const token = authHeader;
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded) {
        if(err) {
            return res.status(401).send({message: 'Unauthorized Access'});
        }
        req.decoded = decoded;
        next();
    });
} */

// Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});



// Local
/* const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri); */

async function run() {
    try {
        const usersCollection = client.db('dressRecycle').collection('users');
        const categoriesCollection = client.db('dressRecycle').collection('categories');
        const productsCollection = client.db('dressRecycle').collection('products');
        const wishListsCollection = client.db('dressRecycle').collection('wishLists');
        const ordersCollection = client.db('dressRecycle').collection('orders');
        const paymentsCollection = client.db('dressRecycle').collection('payment');

        // JWT
        app.post("/jwt", (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                expiresIn: '5h'
            });
            res.send({token});
        });

        app.get("/products/:email", async (req, res) => {
            const email = req.params.email;
            /* const decoded = req.decoded;
            if(decoded.email !== email) {
                res.status(401).send({message: 'Unauthorized Access'});
            } */
            const query = {sellerEmail: email};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });

        app.get("/products2/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        app.post("/orders", async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        app.post("/payments", async (req, res) => {
            const payment = req.body;
            const result = await paymentsCollection.insertOne(payment);
            res.send(result);
        });

        app.get("/orders/id/:id", async (req, res) => {
            const id = req.params.id;
            const query = {productId: id};
            const results = await ordersCollection.findOne(query);
            res.send(results);
        });

        app.get("/orders/:email", async (req, res) => {
            const email = req.params.email;
            /*  const decoded = req.decoded;
             if(decoded.email !== email) {
                 res.status(401).send({message: 'Unauthorized Access'});
             } */
            const query = {userEmail: email};
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result);
        });

        app.delete('/wishLists/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await wishListsCollection.deleteOne(query);
            res.send(result);
        });

        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            /* const decoded = req.decoded;
            if(decoded.email !== email) {
                res.status(401).send({message: 'Unauthorized Access'});
            } */
            const query = {email: email};
            const result = await usersCollection.findOne(query);
            res.send(result);
        });

        app.get('/users2/:email', async (req, res) => {
            const email = req.params.email;
            /* const decoded = req.decoded;
            if(decoded.email !== email) {
                res.status(401).send({message: 'Unauthorized Access'});
            } */
            const query = {email: email};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/users/role2/seller', async (req, res) => {
            const query = {
                role: 'seller',
                isAdmin: false
            };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/users/role2/buyer', async (req, res) => {
            const query = {
                role: 'buyer',
                isAdmin: false
            };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/users/role2/admin', async (req, res) => {
            const query = {
                isAdmin: true
            };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.put('/users/makeAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    isAdmin: true
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/users/cancelAdmin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    isAdmin: false
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/users/seller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    isVerified: true
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/users/seller2/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    isVerified: false
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
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

        app.get("/wishLists/:email", async (req, res) => {
            const email = req.params.email;
            /* const decoded = req.decoded;
            if(decoded.email !== email) {
                res.status(401).send({message: 'Unauthorized Access'});
            } */
            const query = {userEmail: email};
            const wishLists = await wishListsCollection.find(query).toArray();
            res.send(wishLists);
        });

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/products/report/:report", async (req, res) => {
            const report = Boolean(req.params.report);
            const query = {reportToAdmin: report};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.delete('/products/report/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/products", async (req, res) => {
            const query = {};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/products/all/advertise", async (req, res) => {
            const query = {
                soldOut: false,
                advertise: true
            };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/categories", async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/categories/:id", async (req, res) => {
            const id = req.params.id;
            const query = {categoryId: id};
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.get("/products/id/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result);
        });

        // U from CRUD
        app.put('/products/update/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const product = req.body;
            const option = {upsert: true};
            const updatedDoc = {
                $set: {
                    category: product.category,
                    condition: product.condition,
                    description: product.description,
                    image: product.image,
                    location: product.location,
                    originalPrice: product.originalPrice,
                    productName: product.productName,
                    resalePrice: product.resalePrice,
                    yearsOfUse: product.yearsOfUse,
                    date: product.date
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        });

        app.put('/products/report/:id', async (req, res) => {
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

        app.put('/products/unreport/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    reportToAdmin: false
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/products/advertise2/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    advertise: true
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/products/unAdvertise2/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    advertise: false
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/products/soldOut/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    soldOut: true
                }
            };
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.put('/products/unSoldOut/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set: {
                    soldOut: false,
                    advertise: false
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