const jwt=require("jsonwebtoken")
const verifyToken=(req, res, next)=> {
    const token = req.headers['x-token'];
  try{
    if (!token) {
      return res.status(403).json({ message: 'Token not provided' });
    } 
    
  
  let decode=  jwt.verify(token,"na", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = decoded.user;
      next();
    });
  }catch(err){
console.log(err)
  }
   
  }
  module.exports={verifyToken}