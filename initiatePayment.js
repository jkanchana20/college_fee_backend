const express = require('express');
const sha256 = require('crypto-js/sha256');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const dotenv=require('dotenv')
const merchantId = 'PGTESTPAYUAT';
const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
const saltIndex = '1';
dotenv.config()
const BASE_URL=process.env.BASE_URL;
const initiatePayment = async (req, res) => {
  try {
    const transactionId = 'VIT' + req.body.rollNumber + uuidv4().slice(0, 4).toUpperCase();
    const payload = {
      merchantId: merchantId,
      merchantTransactionId: transactionId,
      merchantUserId: req.body.name + '-' + req.body.rollNumber,
      amount: req.body.amount * 100,
      redirectUrl: `${BASE_URL}/api/status/${transactionId}`,
      redirectMode: 'POST',
      callbackUrl: `${BASE_URL}/api/status/${transactionId}`,
      mobileNumber: req.body.mobile,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const dataPayload = JSON.stringify(payload);
    const dataBase64 = Buffer.from(dataPayload).toString('base64');
    const fullURL = dataBase64 + '/pg/v1/pay' + saltKey;
    const dataSha256 = sha256(fullURL);
    const checksum = dataSha256 + '###' + saltIndex;

    const UAT_PAY_API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';

    const response = await axios.post(
      UAT_PAY_API_URL,
      { request: dataBase64 },
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
        },
      }
    );

    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
    res.json({ redirectUrl, transactionId });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { initiatePayment };
