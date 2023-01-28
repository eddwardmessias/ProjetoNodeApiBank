const { response, json } = require('express');
const express = require('express');
const app = express();
const {v4: uuidv4} = require('uuid')

app.use(express.json())
const customers = [];

function verifyIfExistAccountCPF(req,res,next){

    const {cpf} = req.headers;

    const customer = customers.find((customer)=>customer.cpf === cpf);

    if(!customer){
        return res.status(400).json({error: "Customer not found"});
    }

    req.customer = customer;

    return next();

}


app.post("/account",(req,res)=>{
    const {cpf, name} = req.body;
    

    const customerAlreadyExist = customers.some((customer)=> customer.cpf === cpf);

    if(customerAlreadyExist){
        return res.status(400).json({erro: "Customer already exists!"})
    }

    customers.push({
        cpf,
        name,
        id: id = uuidv4(),
        transaction: []
    });

    return res.status(201).send()

});

app.get("/trasaction", verifyIfExistAccountCPF, (req,res)=>{

    const { customer } = req;


    return res.json(customer.transaction);
})

app.post("/deposit", verifyIfExistAccountCPF, (req,res)=>{

    const {description, amount} = req.body;

    const {customer} = req;

    const transactionOperation = {
        description,
        amount,
        createAt: new Date(),
        type: "credit"
    };

    customer.transaction.push(transactionOperation);

    return res.status(201).send();

});


app.listen(3333);