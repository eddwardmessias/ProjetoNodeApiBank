const {response,json} = require('express');
const express = require('express');
const app = express();
const {v4: uuidv4} = require('uuid')

app.use(express.json())
const customers = [];

function verifyIfExistAccountCPF(req, res, next) {

    const {cpf} = req.headers;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return res.status(400).json({
            error: "Customer not found"
        });
    }

    req.customer = customer;

    return next();

}

function getBalance(transaction) {
    const balance = transaction.reduce((acc, operation) => {

        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }

    }, 0);

    return balance;

}

app.post("/account", (req, res) => {
    const {cpf,name} = req.body;

    const customerAlreadyExist = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExist) {
        return res.status(400).json({
            erro: "Customer already exists!"
        })
    }

    customers.push({
        cpf,
        name,
        id: id = uuidv4(),
        transaction: []
    });

    return res.status(201).send()

});

app.get("/trasaction", verifyIfExistAccountCPF, (req, res) => {
    const {customer} = req;

    return res.json(customer.transaction);
});

app.post("/deposit", verifyIfExistAccountCPF, (req, res) => {
    const { description, amount} = req.body;

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

app.post("/withdraw", verifyIfExistAccountCPF, (req, res) => {

    const { amount } = req.body;
    const {customer} = req;

    const balance = getBalance(customer.transaction);

    if (balance < amount) {
        return res.status(400).json({
            error: "Insufficent funds!"
        });
    }

    const transactionOperation = {
        amount,
        createAt: new Date(),
        type: "debit"
    }

    customer.transaction.push(transactionOperation);

    return res.status(201).send();

});

app.get("/trasaction/date", verifyIfExistAccountCPF, (req, res) => {

    const {customer} = req;

    const {date} = req.query;

    const dateFormat = new Date( date + " 00:00");

    const transaction = customer.transaction.filter(
        (transaction) =>
        transaction.createAt.toDateString() ===
        new Date(dateFormat).toDateString()
    );

    return res.json(transaction);
});

app.put("/account", verifyIfExistAccountCPF, (req, res) => {
    const {name} = req.body;
    const {customer} = req;

    customer.name = name;

    return res.status(201).send();
});

app.get("/account", verifyIfExistAccountCPF, (req, res) => {
    const { customer} = req;

    return res.json(customer);
});

app.delete("/account", verifyIfExistAccountCPF, (req, res) => {
    const {customer} = req;

    customers.splice(customer,1);

    return res.status(200).json({customers});

});

app.get("/balance",verifyIfExistAccountCPF, (req, res) => {
    const {customer} = req;

    const balance = getBalance(customer.transaction);

    return res.json(balance);
    
});


app.listen(3333);