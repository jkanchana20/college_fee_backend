const { Student } = require("../Model/studentSchema");

const transactions = async (req, res) => {
  try {
    const { transactionId, amount, categoryFee } = req.body;
    const rollNumber = req.params.rollNumber;

    const user = await Student.findOne({ rollNumber });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingTransaction = user.transactions.find((t) => t.transactionId === transactionId);
    if (existingTransaction) {
      return res.status(400).json({ error: 'Duplicate transaction', message: 'This transaction is already saved' });
    }

    const newTransaction = {
      transactionId,
      amount,
      categoryFee,
 
      timestamp: new Date(),
     
    };

    user.transactions.push(newTransaction);
    await user.save();

    res.status(200).json({ message: 'Transaction added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { transactions };
