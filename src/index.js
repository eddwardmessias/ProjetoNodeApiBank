const express = require('express');

const app = express();
app.use(express.json())

app.get("/courses", (req, res) => {
    const query = req.query;
    console.log(query);
    return res.json(["Java", "JavaScript", "Angular"])
});

app.post("/courses", (req, res) => {
    const body = req.body;
    console.log(body);
    return res.json(["Java", "JavaScript", "Angular", "React"])
})

app.put("/courses/:id", (req, res) => {
    const {id} = req.params;
    console.log({id});
    return res.json(["NodeJS", "JavaScript", "Angular", "React"])
})

app.patch("/courses/:id", (req, res) => {
    return res.json(["NodeJS", "JavaScript", "Angular", "ReactNative"])
})

app.delete("/courses/:id", (req, res) => {
    return res.json(["Angular"])
})


app.listen(3333);