// all the imports 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dbfeeds from './dbfeeds.js'
import Pusher from 'pusher';

// pusher
const pusher = new Pusher({
    appId: "1171159",
    key: "941d587c09df996f8ec2",
    secret: "2335f92a2c26ddf536ed",
    cluster: "eu",
    useTLS: true
});

// app config
const app = express();
const port = process.env.PORT || 9000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// db config
// mongodb+srv://admin:si5bCkxrIT3gu9AI@cluster0.c98sx.mongodb.net/linkedindb?retryWrites=true&w=majority

mongoose.connect(" mongodb+srv://admin:si5bCkxrIT3gu9AI@cluster0.c98sx.mongodb.net/linkedindb?retryWrites=true&w=majority", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.once("open", () => {
    console.log('Database connected');
    const changeStream = mongoose.connection.collection('linkedinFeeds').watch();
    changeStream.on('change', (change) => {

        if (change.operationType === 'insert') {
            console.log('Triggered pusher ***IMG UPLOAD***');

            const postdetails = change.fullDocument;
            pusher.trigger('linkedinFeeds', 'inserted', {
                name: postdetails.name,
                description: postdetails.description,
                // photoUrl: req.body.photoUrl,
                message: postdetails.message
            })
        } else {
            console.log('Unknown triggering from pusher');
        }
    })
})

// api routes

app.get('/', (req, res) => {
    res.status(200).send("Hello World");
})

app.post('/new', (req, res) => {
    // const feed = new dbfeeds({
    //     name: req.body.name,
    //     description: req.body.description,
    //     photoUrl: req.body.photoUrl,
    //     message: req.body.message
    // })

    // try {
    //     const newFeed = await feed.save()
    //     res.status(201).json(newFeed)
    // } catch (error) {
    //     res.status(500).json({
    //         message: error.message
    //     })
    // }
    const body = req.body
    dbfeeds.create(body, (err, data) => {
        if (err) {
            res.send(err)
        } else {
            console.log(data)
            res.json(data)
        }
    })

    // dbfeeds.save();
})

app.get("/getfeed", (req, res) => {
    dbfeeds.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// listener

app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);

})