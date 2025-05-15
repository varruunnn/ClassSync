import express from "express";


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/",async (req , res)=>{
    res.send({message : "Welcome"});
})




export default app;