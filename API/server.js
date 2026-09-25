const express = require("express");
require('dotenv').config();

const authRouter = require('./routes/auth');
const orderRouter = require('./routes/orders');
const productRouter = require('./routes/products');
const app = express();
app.use(express.json());
app.use('/auth',authRouter);
app.use('/orders',orderRouter);
app.use('/products',productRouter);
const PORT = Number(process.env.PORT) || 3000;


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})