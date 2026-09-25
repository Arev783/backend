const express = require("express");
const { readData,writeData } = require("../utils/fileDB");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.post('/',authenticate,async (req,res)=>{
    try{

        const {items} = req.body;

        if(!items || !Array.isArray(items) || items.length === 0){
            return res.status(400).json({error:"items array is required"});
        }

        const data = await readData('products.json');
        const products = JSON.parse(data);
for(const item of items){
       const product = products.find(p=>item.productId === p.id)
 if(!product){
   return res.status(400).json({error:"Invalid request"});
 }
 if(product.stock < item.quantity){
    return res.status(400).json({error:"Don't have enough stock"})
 }
}
    let total = 0;
for(const item of items){
       const product = products.find(p=>item.productId === p.id)
       product.stock-=item.quantity;
 total += product.price * item.quantity;
}

await writeData("products.json",JSON.stringify(products,null,2));

const order = await readData("orders.json");
const orders = JSON.parse(order);
const neworder = {
    id: orders.length ? Math.max(...orders.map(o=>o.id)) + 1 : 1,
    userId:req.user.id,
    items,
     total,
      createdAt:new Date().toISOString()

}
orders.push(neworder);
await writeData("orders.json", JSON.stringify(orders, null, 2));
res.status(201).json(neworder);
    }catch(err){
        console.error(err);
        res.status(500).json({error:"Server error"});
    }
})

router.get('/',authenticate,async (req,res)=>{
try{
    const data = await readData('orders.json');
    const orders = JSON.parse(data);

   const filterorders = orders.filter((or)=>{
        return or.userId === req.user.id;
    })

    res.json(filterorders);
}catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
}
})

router.get('/:id',authenticate,async (req,res)=>{

try{

    const data = await readData('orders.json');
    const orders = JSON.parse(data);

    const order = orders.find((o)=>o.id === Number(req.params.id));

    if(!order){
        return res.status(404).json({error:"This order dont defaond"});
    }
    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.role === "admin";

if( !isOwner && !isAdmin){
    return res.status(403).json({error:"Forbidden"});
}

    res.json(order);
    

}catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
}


})

module.exports = router;