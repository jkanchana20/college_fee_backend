const { Student } = require("../Model/studentSchema");
const jwt=require("jsonwebtoken")
const StudentL = async (req, res) => {
  const { rollNumber, password } = req.body;
  
  try {
    const studentE = await Student.findOne({ rollNumber });

    if (!studentE) {
      return res.status(401).json({ message: "No student found with this roll number" });
    }

    if (studentE.password === password) {
      let payload={
        user:{
          id:studentE.id
        }
      }
      const token = jwt.sign(payload,"na", {
        expiresIn: '10h'}); 
        console.log(token)
      return res.status(201).json({ message: "Logged in successfully" ,token});
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during login, try again" });
  }
};

module.exports = { StudentL };
