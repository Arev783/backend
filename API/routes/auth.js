const  bcrypt = require("bcrypt");
const express = require("express");
const {readData,writeData} = require('../utils/fileDB');
const  jwt = require("jsonwebtoken");
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({error:'username and password are required'});
        }

        const data = await readData('users.json');
        const users = JSON.parse(data);
        if(users.find(u=>u.username === username)){
            return res.status(409).json({error:'Username already exists'});
        }

        const newUser = {
            id: users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1,
            username,
            passwordHash: await bcrypt.hash(password,10),
            role:'customer'
        }

        users.push(newUser);
        await writeData('users.json', JSON.stringify(users, null, 2));
        res.status(201).json({id:newUser.id, username:newUser.username, role:newUser.role});
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'Something went wrong'});
    }
})

const SECRET = process.env.JWT_SECRET;
router.post("/login", async (req,res)=>{
    try{
const {username,password} = req.body;
   const data = await readData('users.json');
        const users = JSON.parse(data);
const user = users.find((u)=>u.username === username);
const passwordMatch = await bcrypt.compare(password, user?.passwordHash || '');
if(!user || !passwordMatch){
    return res.status(401).json({error:'Invalid'});
}
const token = jwt.sign({id: user.id, username: user.username, role: user.role}, SECRET, {expiresIn: '1h'});
res.json({token});
    } catch (err) {
        console.error(err);
        res.status(500).json({error:'Something went wrong'});
    }
})

module.exports = router;