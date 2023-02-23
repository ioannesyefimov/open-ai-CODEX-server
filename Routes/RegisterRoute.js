import express from 'express'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'

import {Errors} from '../Errors/Errors.js'

export function validatePassword(password, name){
    // check whether password doesn't contains at least 
    // 1 uppercase, 1 lowercase, 1 number, and 1 special character. 
    // If it doesn't contains everything mentioned, returns true
    const password_rgx = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/

    function kmpSearch(pattern, text) {
      
        if (pattern.length == 0)
          return 0; // Immediate match
        // change inputs to lowercase so that comparing will be non-case-sensetive
       pattern = pattern.toLowerCase()
       text = text.toLowerCase()
        // Compute longest suffix-prefix table
        let lsp = [0]; // Base case
        for (let i = 1; i < pattern.length; i++) {
          let j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
          while (j > 0 && pattern[i] !== pattern[j])
            j = lsp[j - 1];
          if (pattern[i] === pattern[j])
            j++;
          lsp.push(j);
        }
      
        // Walk through text string
        let j = 0; // Number of chars matched in pattern
        for (let i = 0; i < text.length; i++) {
          while (j > 0 && text[i] != pattern[j])
            j = lsp[j - 1]; // Fall back in the pattern
          if (text[i]  == pattern[j]) {
            j++; // Next char matched, increment position
            if (j == pattern.length)
              return i - (j - 1);
          }
        }
        return -1; // Not found
      }
    
      const hasNamePatternInPassword = kmpSearch(name, password)

      const isInValidPassword = password_rgx.test(password)
    
    if((hasNamePatternInPassword != -1) ){
        return Errors.PASSWORD_CONTAINS_NAME
    } else if(isInValidPassword === true) {
        return Errors.INVALID_PASSWORD
    } else {
      return `valid`
    }
}


import {Login,User} from '../mongodb/models/index.js'

import {conn} from '../mongodb/connect.js'
dotenv.config()

const router = express.Router()



// CREATE A USER

router.route('/').post(async(req, res)=>{
    
    try {
      const session = await conn.startSession();

        const {name, email, password} = req.body
        // validate form submission
        if(!name|| !email|| !password) {
            return res.status(400).json(`incorrect form submission`)
        } 
        else  if(validatePassword(password,name) == Errors.INVALID_PASSWORD){
            return res.status(400).json(Errors.INVALID_PASSWORD)
        } 
        else if(validatePassword(password, name) == Errors.PASSWORD_CONTAINS_NAME){
            return res.status(400).json(JSON.stringify(Errors.PASSWORD_CONTAINS_NAME))
    
        }
        if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) === false) {
            return res.status(400).json(Errors.INVALID_EMAIL)
        }
       


        const hash = bcrypt.hashSync(password, 10)


        await session.withTransaction(async()=>{
            const loginUser = await Login.create([{
                email: email,
                password: hash
            }], {session});

            const user = await User.create([
                {
                    email: email,
                    name: name
                }
            ], {session});

            console.log(`success`)
            res.status(201).json({success:true,data:user});
            session.endSession()
        });
        
    } catch (error) {
        console.log(`error: `, error)
        res.status(500).json({success:false, message: error})
    }
})

// DELETE A MESSAGE 


export default router