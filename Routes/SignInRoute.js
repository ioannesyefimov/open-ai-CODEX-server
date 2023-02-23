import express from 'express'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'


import {Login,User} from '../mongodb/models/index.js'

import {conn} from '../mongodb/connect.js'
dotenv.config()

const router = express.Router()



// SING IN ROUTE

router.route('/').post(async(req, res)=>{
    // const session = await conn.startSession();
    
    try {
        const {email, password} = req.body
        if(!email || !password) res.status(400).send({success:false, message:`incorrect form submission`})

          Login.find({email: email}, function(err,result){
            if(err){
                console.log(err)
            } else {
                const isValid = bcrypt.compareSync(password, result[0].password)
               if(isValid){
                    User.find({email: email}, function(err,user){
                        if(user){

                            res.status(200).send({success:true, data: user[0]})
                        } else {
                            console.log(`error`, res)
                        }
                    })
                } else if(!isValid) {
                    res.status(400).send({success:false, message: "WRONG_PASSWORD"})
                }
            }
        })
        
    } catch (error) {
        console.log(`error: `, error)
        res.status(500).json({success:false, message: error})
        // await session.abortTransaction()
    }
    // session.endSession()
})

// DELETE A MESSAGE 


export default router