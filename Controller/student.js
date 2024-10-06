const express = require('express');
const { Student } = require('../Model/studentSchema');

const storeStudent = async (req, res) => {
  const {
    name,
    rollNumber,
    mobileNumber,
    password,
    admissionType,
    year,
    section,
    paidFee,
    totalFee,
    regulation,
    dob,
    role,
    address,
    guardianName,
    email,
  } = req.body;

  
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const { buffer, mimetype } = req.file;

  if (
    !mobileNumber ||
    !rollNumber ||
    !name ||
    !password ||
    !admissionType ||
    !year ||
    !section ||
    !paidFee ||
    !totalFee ||
    !regulation ||
    !dob ||
    !role ||
    !email ||
    !address ||
    !guardianName ||
    !buffer ||
    !mimetype
  ) {
    console.log('User is not created');
    return res.status(400).json({ error: 'User is not created. Please provide valid data.' });
  }

  try {
    const newStudent = new Student({
      name,
      rollNumber,
      role,
      dob,
      mobileNumber,
      password,
      admissionType,
      year,
      section,
      paidFee,
      regulation,
      totalFee,
      address,
      email,
      guardianName,
      profileImage: {
        data: buffer,
        contentType: mimetype,
      },
    });

    const existStudent = await Student.findOne({ rollNumber });

    if (existStudent) {
      return res.json({ message: 'User exists with this roll number' });
    }

    await newStudent.save();
    return res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 11000 && error.keyPattern && error.keyValue) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      const duplicateValue = error.keyValue[duplicateField];
      return res.status(400).json({ error: `Duplicate key error: ${duplicateField} '${duplicateValue}' already exists.` });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { storeStudent };
