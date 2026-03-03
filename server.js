import app from "./app.js";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({quiet:true})

const DB=process.env.DATABASE

// try{

//     mongoose.connect(DB)
//     console.log("connected")


// }catch(err){

//     console.log(err);
//     console.log('not connected')

// }

const port = process.env.PORT


app.listen(port,()=>{

    console.log(`port is running ${port}`)
})



