const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  categoryFee: {
    type: String,
    required: true,
  }
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  role:{
type:String,
required:true,
  },
  dob:{
    type:Date,
    required:true,
  },
  mobileNumber: {
    type: String,
    required:true,
  },
  password:{
    type: String,
    required: true,

  },
  admissionType:{
    type: String,
    required:true,

  },
  year: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  paidFee:{
    type: String,
    required: true,

  },
  regulation:{
type:String,
required:true,
  },
  totalFee: {
    type: String,
    required:true,
  },
  address:{
    type:String,
    required:true,

  },
email:{
    type:String,
    required:true,
  },
  guardianName:{
    type:String,
    required:true,
  },

  transactions: [transactionSchema],
  profileImage: {
    data: Buffer,
    contentType: String,
  },

});

const Student = mongoose.model("Student", studentSchema);

module.exports = {Student};
