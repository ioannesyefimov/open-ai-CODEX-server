import express from 'express'
import * as dotenv from 'dotenv'

import {Message} from '../mongodb/models/index.js'

dotenv.config()

const router = express.Router()

// get all messages 

router.route('/').get(async(req,res)=>{
    try {
        const Messages = await Message.find({})

        res.status(200).json({success: true, data:Messages})
    } catch (error) {
        res.status(500).json({success: false, message: error})
    }
})

// get specific message
router.route('/profile/messages/:email').get(async(req,res)=>{
    const email = req.params.email

    const foundMessage =  Message.find({email: email}, function(error, result){
        if(error || !result[0]) {
            res.status(400).send({success:false, message: error ? error : "not found"})
        } else {

            res.status(200).send({success: true, data:result})
        }
    })
})


// CREATE A MESSAGE

router.route('/').post(async(req, res)=>{
    try {
        const {messageId, message, email, prompt} = req.body

        const newMessage = await Message.create({
            messageId, 
            message,
            email,
            prompt,
            time: Date.now()
        })
        
        res.status(201).json({success:true,data:newMessage});
    } catch (error) {
        res.status(500).json({success:false, message: error})
    }
})

// DELETE A MESSAGE 

router.route('/').delete(async(req,res)=>{
    try {
        const {messageId, message} = req.body
        Message.deleteOne({messageId: messageId}, function(err){
        if(err) console.log(err)
       })
        res.status(200).json({success:true, data:`${messageId} has been deleted` })
    } catch (error) {
        res.status(500).json({success:false, message:error})
    }
})

export default router