import express from 'express'
import { User } from '../models/users.js';
import bcrypt from 'bcryptjs'
import jwt, { decode } from 'jsonwebtoken'

const router = express.Router()
const secretKey = 'ajdi3289^^$(czljfok';

router.post('/register',async (req,res)=>{

    const {name,email,password} = req.body;

    try {

        if(!name || !email|| !password) return res.status(400).json({message:`All Fields are required`})
        
        const exisitingUser = await User.findOne({email})
        if(exisitingUser){
           return res.status(400).json({message:`User already exists`})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({name,email,password:hashedPassword})
        await newUser.save();

        return  res.status(201).json({message:`User Created Successfully`,newUser})

        
    } catch (error) {
        console.log(`Error in register ${error.message}`)
       return  res.status(400).json({message:`Error in register ${error}`})
    }
})


// login

router.post('/login', async(req,res)=>{

    const {email,password} = req.body;

    try {
        if( !email|| !password) return res.status(400).json({message:`All Fields are required`})
            
        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({ message: "User doesnt exist" });
        }

        const verifyPassword = await bcrypt.compare(password,user.password)
       

        if(!user || !verifyPassword){
            return res.status(400).json({message:`Invalid Creds`})
        }

        const token = jwt.sign({id:user._id, email:user.email},secretKey,{expiresIn:'2h'})
        

        return res.status(200).json({ message: "Login Successful", user, token:token });
        } catch (error) {
        console.log(`Error in login ${error.message}`)
       return  res.status(400).json({message:`Error in Login ${error}`})
    }

})

// profile

router.post('/profile',async (req,res)=>{
    try{
        const token = req.headers?.authorization?.split(' ')[1]
        if(!token){
            return  res.status(400).json({message:`Access denied `})
        }

        jwt.verify(token,secretKey,async (err,decode)=>{
            const user = await User.findById(decode?.id)
            
            if(!user){
                return res.status(400).json({message:'Invalid Token'});
            }

            const userData = {
                id:user?.id,
                name:user?.name,
                email:user?.email
            }
            return res.status(201).json({message:'Profile Data',data:userData})
        })
        
    }catch (error) {
        console.log(`Error in login ${error.message}`)
       return  res.status(400).json({message:`Something went wrong in Profile ${error}`})
    }
})


export default router;
