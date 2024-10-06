const merchantId = "PGTESTPAYUAT";
const saltKey = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const saltIndex = '1';
const crypto = require('crypto');
const axios=require("axios")


const checkStatus = async (req, res) => {
    try {
      const merchantTransactionId = req.params.transactionId;
      const currentMerchantId = merchantId;
      
      const keyIndex = 1;
      const string = `/pg/v1/status/${currentMerchantId}/${merchantTransactionId}` + saltKey;
      const sha256Checksum = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = sha256Checksum + "###" + keyIndex;
  
      const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${currentMerchantId}/${merchantTransactionId}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': `${currentMerchantId}`,
        },
      };
      const response = await axios.request(options);
  
      console.log('PhonePe Status Response:', response.data);

  if (response.data.success === true) {
    
  
    return res.redirect(`http://localhost:3000/success?userId=${merchantTransactionId}`);
  } else {
    return res.redirect(`http://localhost:300/failure`);
  }
  }catch (error) {
      console.error('Error checking payment status:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
  module.exports={checkStatus}