const { User, Conversation, Message } = require('../models/index');

const getMessagesFromChat = async (conversationId) => {
  const messages = await Message.find({ conversationId: conversationId }).limit(20);
  return messages;
};

const addMessage = async ({ senderId, receiverId, conversationId, message }) => {
  if (!conversationId) {
    const conversation = await Conversation.create({ senderId: senderId, receiverId: receiverId });
    conversationId = conversation._id;
  }

  const newMessage = await Message.create({
    senderId: senderId,
    receiverId: receiverId,
    conversationId: conversationId,
    message: message,
  });
  return newMessage;
};

const getConversationList = async (id) => {
  let conversationList = await Conversation.find({ $or: [{ senderId: id }, { receiverId: id }] });

  let conversationDetails = await conversationList.reduce(async (conversations, item) => {
    const userId = id == item.receiverId ? item.senderId : item.receiverId;

    const [userDetails, lastMessage] = await Promise.all([
      User.findOne({ _id: userId }).select('first_name last_name resize_profile_image _id'),
      Message.findOne({ conversationId: item._doc._id }).sort({ createdAt: -1 }),
    ]);

    const details = {
      conversationId: item._doc._id,
      friendId: userDetails?._id,
      first_name: userDetails?.first_name,
      last_name: userDetails?.last_name,
      profilePic: userDetails?.resize_profile_image,
      lastMessage: lastMessage?.message || '',
      lastMessageTime: lastMessage?.createdAt || '',
      seen: lastMessage?.isSeen || false,
    };

    const allConversations = await conversations;
    if (details.lastMessage && details.lastMessage != '') return allConversations.concat([details]);
    else return allConversations;
  }, []);

  await conversationDetails.sort((obj1, obj2) => {
    let dateA = new Date(obj1.lastMessageTime).getTime();
    let dateB = new Date(obj2.lastMessageTime).getTime();
    return dateA < dateB ? 1 : -1;
  });

  return conversationDetails;
};

const getConversationDetails = async (id, friendId) => {
  let conversationdetails = await Conversation.findOne({
    $or: [
      { senderId: id, receiverId: friendId },
      { senderId: friendId, receiverId: id },
    ],
  });

  if (!conversationdetails) {
    const conversation = await Conversation.create({ senderId: id, receiverId: friendId });
    return conversation?.id;
  } else {
    return conversationdetails?.id;
  }
};

const seenMessage = async (data) => {
  const receiverId = data.receiverId;
  const conversationId = data.conversationId;
  await Message.updateOne(
    { receiverId: receiverId, conversationId: conversationId },
    {
      isSeen: true,
    }
  );
};

module.exports = {
  getMessagesFromChat,
  addMessage,
  getConversationList,
  seenMessage,
  getConversationDetails,
};
