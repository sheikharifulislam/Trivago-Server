const express  = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config()
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jrudo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
   try{
        await client.connect();
        const database = client.db('trivago');
        const userOrderCollection = database.collection("User-Order");
        const allOrder = database.collection("All-Order");
        const allService = database.collection("All-Service");
        
        userOrderCollection.insertOne({
            name: 'Ariful',
        })

       
   }
   catch(error) {
       console.log(error);
   }
   finally {
       // await client.close();
   }
}

app.get('/', async(req,res) => {
    res.send("<h1>Well Come</h1>")
})

run();






const port = process.env.PORT || 5000;
app.listen(port, () =>console.log(`server is running at port ${port}`));