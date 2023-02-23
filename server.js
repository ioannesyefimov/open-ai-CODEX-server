import express from 'express';
import * as dotenv from 'dotenv'

import cors from 'cors'
dotenv.config()

import connectDB from './mongodb/connect.js';

import {OpenAIRoute, MessageRoute, RegisterRoute, SignInRoute} from './Routes/index.js'

const app = express()
app.use(cors())
app.use(express.json({limit:'50mb'}));

app.get('/', async(req,res)=>{
    res.status(200).send({message: `Hello from C0diNex`})
})

app.use('/api/v1/codex', OpenAIRoute)
app.use('/api/v1/post', MessageRoute)

// Register User 
app.use('/api/v1/register', RegisterRoute)

// SIGN IN
app.use('/api/v1/signin', SignInRoute)

const StartServer = async ()=>{
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(5000, ()=> console.log(`Server is running on port http://localhost:5000`))
        
    } catch (error) {
        console.log(error)
    }
}

StartServer()