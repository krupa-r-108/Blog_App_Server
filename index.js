import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(express.json())

app.use(cors({
  origin:true,
  credentials:true
}
));

const PORT = 8000;

app.use(express.json())

app.get('/',(req,res)=>{
  res.send('Running');
})

app.use('/users',router)

mongoose.connect(process.env.DB_URL).then(()=>console.log(`Mongodb connected`)).catch((err)=>console.log(`error in db connection ${err}`))


app.listen(PORT,()=>{
  console.log(`Server up port ${PORT}`)
})