const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.11ltg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const port = 5000

console.log(process.env.DB_USER);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


client.connect(err => {
  const foodsCollection = client.db("food-making").collection("foods");
  const orderCollection = client.db("food-making").collection("orders");
  const reviewCollection = client.db("food-making").collection("review");
  const adminCollection = client.db("food-making").collection("admin");

  app.post('/addCourse', (req, res) => {
    const course = req.body;
    foodsCollection.insertOne(course)
      .then(result => {
        console.log('sucess data')
        res.redirect('/')
      })
  })

  app.post('/addReview', (req, res) => {
    const singleReview = req.body;
    reviewCollection.insertOne(singleReview)
      .then(result => {
        console.log('sucess data')
        res.redirect('/')
      })
  })
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        console.log('sucess data')
        res.redirect('/')
      })
  })

  app.post('/payment', (req, res) => {
    const payment = req.body;
    orderCollection.insertOne(payment)
      .then(result => {
        console.log('sucess data')
        res.redirect('/')
      })
  })

  app.get('/reviews', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents) => {
        // console.log(documents)
        res.send(documents)

      })
  })
  app.post('/checkout', (req, res) => {
    const course = req.body;
    orderCollection.insertOne(course)
      .then(result => {
        console.log('sucess data')
        res.redirect('/')
      })
  })
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    foodsCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log(result);
      })
  })

  app.get('/courses', (req, res) => {
    foodsCollection.find({})
      .toArray((err, documents) => {
        // console.log(documents)
        res.send(documents)

      })
  })

  // app.get('/courses/:id',(req,res)=>{
  //   foodsCollection.find({_id : ObjectID(req.params.id)})
  //   .toArray((err,documents)=>{
  //     // console.log(documents)
  //     res.send(documents[0])

  //   })
  // })


  // app.put('/courses/update/:id',(req,res)=>{
  //   console.log(req.body)
  //   foodsCollection.updateOne({_id : ObjectID(req.params.id)},
  //   {
  //     $set : {}
  //   }
  //   )
  //   .then(res =>{
  //     console.log(res)
  //   })
  // })
  app.get('/orders', (req, res) => {
    // console.log(req.query.email)
    adminCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        // console.log(documents)
        const filter = {};
        if (documents.length === 0) {
          filter.email = req.query.email;
        }
        orderCollection.find(filter)
          .toArray((err, documents) => {
            // console.log(documents)
            res.send(documents)

          })

      })


  })

  app.post('/isAdmin', (req, res) => {
    // console.log(req.query.email)
    adminCollection.find({ email: req.body.email })
      .toArray((err, documents) => {
        // console.log(documents)
        res.send(documents.length > 0)
      })


  })

});


