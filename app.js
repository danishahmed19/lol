import express from 'express';
import UserRouter from './Routes/UserRouter.js';
import AdminRouter from './Routes/AdminRouter.js';
const app = express();
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './dbconfig.js';

dotenv.config({ quiet: true })

await connectDB()

app.use(cors())


app.use(express.json());



app.use('/user', UserRouter)
app.use('/admin', AdminRouter)






export default app;