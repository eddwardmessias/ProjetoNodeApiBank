const express = require('express');

const app = express();

app.get("/courses", (req,res)=>{
    return res.json(["Java", "JavaScript", "Angular"])
});

app.post("/courses",(req,res)=>{
    return res.json(["Java", "JavaScript", "Angular", "React"])
})

app.put("/courses/:id", (req,res)=>{
    return res.json(["NodeJS", "JavaScript", "Angular", "React"])
})

app.patch("/courses/:id", (req,res)=>{
    return res.json(["NodeJS", "JavaScript", "Angular", "ReactNative"])
})

app.delete("/courses/:id", (req,res)=>{
    return res.json(["Angular"])
})


app.listen(3333);
