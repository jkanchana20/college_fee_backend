const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { checkStatus } = require('./status');
const { initiatePayment } = require('./initiatePayment');
const { Student } = require('./Model/studentSchema');
const { storeStudent } = require('./Controller/student');
const { transactions } = require('./Controller/transaction');
const { StudentL } = require('./Controller/StudentL');
const { verifyToken } = require('./Controller/jwt/middleWear');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const router = express.Router();

app.use(cors());
app.use(express.json());

const BASE_URL = process.env.BASE_URL;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

router.post('/initiatePayment', initiatePayment);
router.post('/api/status/:transactionId', checkStatus);
router.post('/registration',upload.single("profileImage"), storeStudent);
router.post('/addTransaction/:rollNumber', transactions);
router.post('/login', StudentL);
router.get('/user', verifyToken, async (req, res) => {
  try {
    const user = await Student.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/allTransactions', async (req, res) => {
  try {
    const allTransactions = await Student.find({});
   
    return res.json(allTransactions);
  } catch (err) {
    console.log('error at', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/deleteStudent', async (req, res) => {
  const { rollNumber } = req.body;
  try {
    const student = await Student.findOneAndDelete({ rollNumber });
    if (!student) {
      console.log('user not found');
      return res.json({ message: 'User not found with this roll number' });
    } else {
      return res.json({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/updateStudent/:rollNumber', async (req, res) => {

const {rollNumber}=req.params
  try {
    const student = await Student.findOneAndUpdate({ rollNumber },{$set:req.body},{new:true});
    if (!student) {
      console.log('user not found');
      return res.json({ message: 'User not found with this roll number' });
    } else {

      return res.json({ message: 'User updated successfully' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.post('/searchStudent', async (req, res) => {
  const {rollNumber}=req.body
  try {
    const student = await Student.findOne({rollNumber});
   
   if(!student){
    return res.json("non student exist with this roll number")
   }
   else{
    return res.json(student);
   }
  } catch (err) {
    console.log('error at', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
