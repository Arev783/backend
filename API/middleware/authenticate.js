const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

function authenticate(req,res,next){
    try{
    const authHeader = req.headers.authorization;
const token = authHeader?.split(' ')[1];
if(!token){
    return res.status(401).json({error:"Invalid"});
}
const decoded = jwt.verify(token,SECRET);

req.user = decoded;
next();
    }catch(err){
        return res.status(401).json({error: "Invalid or expired token"});
    }

}

module.exports = authenticate;