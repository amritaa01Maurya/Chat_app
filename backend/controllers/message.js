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

const deleteMessage = async (req, res)=>{
  try {
    const {id} = req.params;
    const {username} = req.body;

    const msg = await Message.findById(id);
    if(!msg) {
      return res.status(404).json({msg : "Message not found"});
    }

    if(msg.username !== username) {
      return res.status(403).json({msg : "You are not authorized to delete this message"});
    }
    // delete from db
    await Message.findByIdAndDelete(id);

    // broadcast to all clients
    req.io.emit("message_deleted", id);

    res.json({msg : "Message deleted successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getMessage, deleteMessage};