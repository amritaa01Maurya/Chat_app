const Message = require('../models/Message');
    
const getMessage = async (req, res) => {
    try {
        // return all messages, sorted by oldest first
        const msg = await Message.find().sort({ createdAt: 1 });
        res.json(msg);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};

module.exports = { getMessage };