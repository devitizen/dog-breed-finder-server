const express = require("express");
const app = express();
const port = 5000;

const cors = require("cors");
app.use(cors());

const { MongoClient } = require("mongodb");
const key = require("./config/key");
const client = new MongoClient(key.mongoURI);

async function run(name) {
    try {
        await client.connect();
        const database = client.db("dogBreedFinder");
        const breeds = database.collection("breeds");
        return await breeds.findOne({ name: name });
    } finally {
        await client.close();
    }
}


app.get("/", (req, res) => {
    res.send("Hello World.");
});


app.get("/api/breeds", (req, res) => {
    const name = req.query.name;
    run(name)
        .then((breed) => {return res.status(200).send(breed)})
        .catch(console.dir);
});


// listening
app.listen(port, () => {
    console.log(`Dog Breed Finder DB listening on port ${port}`);
});
