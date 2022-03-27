const express  = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config()
const objectId = require('mongodb').ObjectId;
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
        const myOrders = database.collection("User-Order");
        const allOrder = database.collection("All-Order");
        const serviceData = database.collection("All-Service");
        
        //get api
       app.get('/all-services', async(req,res) => {
           const allService = await serviceData.find({}).toArray();
           res.status(200).json(allService);
       })

       app.get('/manage-all-orders', async(req,res) => {
           const result = await allOrder.find({}).toArray();          
           res.send(result);
       })

       app.get('/my-all-orders', async(req,res) => {
           const {userEmailId} = req.query;
           const query = {userEmail: userEmailId};         
           const myAllOrders = await myOrders.find(query).toArray();           
           res.send(myAllOrders);
       })

       app.get('/service-details', async(req,res) => {
            const {serviceId} = req.query;
            const result = await serviceData.findOne({_id: objectId(serviceId)});
            res.send(result)
       })


       //post api
       app.post('/add-order', async(req,res) => {             
            const result = await myOrders.insertOne(req.body);            
            res.send(result);
           
       })

       app.post('/manage-add-orders', async(req,res) => {
           const result = await allOrder.insertOne(req.body);
           res.send(result);
       })
       
       app.post('/add-service', async(req,res) => {
           const result = await serviceData.insertOne(req.body);
           res.send(result);
       })

       //update

       app.patch('/confirm-order/:orderId', async(req,res) => {
           const {orderId} = req.params;           
           const filter = {_id: objectId(orderId)};
           const updateOrderStatus = {
               $set: {
                    orderStatus: "confirm",
               }
           }

           const result = await allOrder.updateOne(filter, updateOrderStatus);
           res.send(result);
       })

       //delete
       app.delete('/delete-my-single-order', async(req,res) => {
           const {orderId} = req.query;
           const result = await myOrders.deleteOne({_id: objectId(orderId)});
           res.send(result);
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
    res.send("<h1>Well Come to Trivago</h1>")
})

run();






const port = process.env.PORT || 5000;
app.listen(port, () =>console.log(`server is running at port ${port}`));