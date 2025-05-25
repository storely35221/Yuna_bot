module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "0.0.1",
  credits: "يونو",
  description: "يمنع الأعضاء من مغادرة المجموعة برسائل ظريفة من البوت الأنثى"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout === false) return;

  // تجاهل إذا البوت هي اللي خرجت
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) ||
               await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  const isSelfLeave = event.author == event.logMessageData.leftParticipantFbId;

  if (isSelfLeave) {
    api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error) => {
      if (error) {
        api.sendMessage(
          `هااا ${name}!! تركتنا فجأة؟! 😾\nما ينفع كذا! رجع بسرعة، أنا ما خلصت كلامي معك! ☕💬`,
          event.threadID
        );
      } else {
        api.sendMessage(
          `رجعت لنا يا ${name}! يا زين اللمه بك 💖✨\nلا تطلع بدون إذني مرة ثانية، واضح؟! 😼`,
          event.threadID
        );
      }
    });
  }
};
