const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors());

const { MongoClient } = require("mongodb");
const key = require("./config/key");
const client = new MongoClient(key.mongoURI);

async function getData() {
    try {
        await client.connect();
        return client.db("dogBreedFinder").collection("dogBreeds");
    } catch (err) {
        console.error(err.message);
    }
}


app.get("/", (req, res) => {
    res.send("Dog Breed Finder DB Server is running.");
});

app.get("/api/all", (req, res) => {
    getData()
        .then((data) => {
            return data.find().toArray();
        })
        .then((breeds) => {
            client.close();
            return res.send(breeds);
        })
        .catch((err) => {
            res.status(500).send("Something wrong with getting data.");
        });
});

app.get("/api/breeds", (req, res) => {
    getData()
        .then((data) => {
            return data.findOne({ name: req.query.name });
        })
        .then((breed) => {
            client.close();
            if (breed === null)
                return res.status(500).send("No data matches the name.");
            return res.send(breed);
        })
        .catch((err) => {
            res.status(500).send("Something wrong with getting data.");
        });
});

// listening
app.listen(port, () => {
    console.log(`Dog Breed Finder DB listening on port ${port}`);
});
