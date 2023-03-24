const {
  getMessagesFromChat,
  addMessage,
  getConversationList,
  seenMessage,
  getConversationDetails,
} = require('./message.service');

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('new-user', async () => {
      io.emit('new-user', members);
    });

    socket.on('join-chat', async ({ newChatId, previousChatId }) => {
      socket.join(newChatId);
      socket.leave(previousChatId);
      let roomMessages = await getMessagesFromChat(newChatId);
      socket.emit('chat-messages', roomMessages);
    });

    socket.on('message', async (data) => {
      const messageDetails = await addMessage(data);
      if (!data.conversationId) {
        let conversationList = await getConversationList(data.senderId);
        socket.emit('conversation-list', conversationList);
        socket.emit('conversation-id', messageDetails.conversationId);
      }

      let roomMessages = await getMessagesFromChat(
        data.conversationId ? data.conversationId : messageDetails.conversationId
      );

      io.to(data.conversationId ? data.conversationId : messageDetails.conversationId).emit('chat-messages', roomMessages);

      let conversationList = await getConversationList(data.senderId);
      io.to(data.conversationId).emit('conversation-list', conversationList);
    });

    socket.on('get-conversation', async (data) => {
      let conversationList = await getConversationList(data.id);
      socket.emit('conversation-list', conversationList);
    });

    socket.on('get-conversation-id', async (data) => {
      let conversationId = await getConversationDetails(data.id, data.friendId);
      socket.emit('conversation-id', conversationId);
    });
  });
};
