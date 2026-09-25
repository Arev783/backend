const express = require("express");
const { readData,writeData } = require("../utils/fileDB");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.get("/",async (req,res)=>{
    try{
        const data = await readData('products.json');
        const products = JSON.parse(data);
        let result = products;
        if(req.query.category){
             result = result.filter((pr)=>{
   return pr.category === req.query.category;
});
        }
        if(req.query.sort === 'price'){
              result.sort((a,b)=>a.price - b.price);
        }
        res.json(result);
    }catch(err){
console.error(err);
res.status(500).json({error:"Server error"});
    }
})

router.get("/:id",async (req,res)=>{
try{
        const data = await readData('products.json');
        const products = JSON.parse(data);
const result = products.find((pr)=>{
    return pr.id === Number(req.params.id);
})
if(!result){
    return res.status(404).json({error:"This product don't defind"});
}
res.json(result);

}catch(err){
    console.error(err);
res.status(500).json({error:"Server error"});
}
})

router.post("/",authenticate,authorize('admin'),async (req,res)=>{
    try{
    const {name,price,category,stock} = req.body;
    if(!name || !price){
       return res.status(400).json({error:"name ad price are required"});
    }

    const data = await readData('products.json');
  const products = JSON.parse(data);

  const newproduct = {
  id: products.length ? Math.max(...products.map(p=>p.id)) + 1 : 1,
    name,
    price,
    category,
    stock
  }

  products.push(newproduct);

  await writeData('products.json',JSON.stringify(products,null,2));
  res.status(201).json(newproduct);
}catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
}
  
})

router.put("/:id",authenticate,authorize('admin'),async (req,res)=>{

    try{
const data = await readData('products.json');
const products = JSON.parse(data);
const {name,price} = req.body;

if(!name || !price){
    return res.status(400).json({error:"name and price are required"});
}
const product = products.find((pr)=>{
    return pr.id === Number(req.params.id);
})
if(!product){
   return res.status(404).json({error: "Product not found"});
}
product.name = name;
product.price = price;

await writeData("products.json",JSON.stringify(products,null,2));

res.status(200).json(product);


    }catch(err){
        console.error(err);
       res.status(500).json({error:"Server error"});
    }
})

router.delete("/:id",authenticate,authorize("admin"),async (req,res)=>{

    try{
    const data = await readData("products.json");
    let products = JSON.parse(data);

    const product = products.find((pr)=>{
        return pr.id === Number(req.params.id);
    })
    
    if(!product){
       return res.status(404).json({error:"Product not found"});
    }

    products = products.filter((pr)=>{
       return pr.id !== Number(req.params.id);
    })

    await writeData("products.json",JSON.stringify(products,null,2));

    res.status(204).send();
}
catch(err){
    console.error(err);
    res.status(500).json({error:"Server error"});
}
})

module.exports = router;