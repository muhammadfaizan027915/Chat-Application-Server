const router = require("express").Router();
const Conversation = require("../Models/Conversation");
const Message = require("../Models/Messages");

router.get("/messages", (req, res) => {
  const user = req.session.user;
  const { reciever } = req.query;

  if (!user)
    return res.status(400).json({ message: "Failed to get messages!" });

  Conversation.findOne({
    $and: [{ members: user._id }, { members: reciever }],
  }).exec((err, conversation) => {
    if (err) return res.status(500).json({ message: "Internal server error!" });

    if (!conversation)
      return res.status(404).json({ message: "No messages found!" });

    Message.find({ conversationId: conversation?._id })
      .populate("sender")
      .exec((err, messages) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error!" });
        }
        return res
          .status(200)
          .json({ messages, conversationId: conversation._id });
      });
  });
});

router.post("/messages", async (req, res) => {
  const user = req.session.user;
  let { text, sender, conversationId, reciever, status } = req.body;

  if (!user)
    return res.status(400).json({ message: "Failed to send message!" });

  if (!conversationId) {
    try {
      const conversation = new Conversation({
        members: [sender, reciever],
      });

      conversationId = await (await conversation.save())._id;
    } catch (error) {
      return res.status(500).json({ message: "Internal server error!" });
    }
  }

  const message = new Message({ conversationId, sender, text, status });
  await message.populate("sender");
  message.save((err, message) => {
    if (err) return res.status(500).json({ message: "Internal server error!" });
    const eventEmitter = req.app.get("eventEmitter");
    eventEmitter.emit("sendmessage", message, reciever);
    return res.status(200).json({ message });
  });
});

module.exports = router;
