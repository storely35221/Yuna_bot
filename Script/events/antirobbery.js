module.exports.config = {
  name: "guard",
  eventType: ["log:thread-admins"],
  version: "1.0.0",
  credits: "يونو",
  description: "منع سرقة أو تغيير الإدمنات"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  const { logMessageType, logMessageData, senderID } = event;
  let data = (await Threads.getData(event.threadID)).data;
  if (data.guard === false) return;

  if (logMessageType === "log:thread-admins") {
    // إضافة إدمن
    if (logMessageData.ADMIN_EVENT === "add_admin") {
      if (event.author == api.getCurrentUserID()) return;
      if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;

      api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
      api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false);

      function editAdminsCallback(err) {
        if (err)
          return api.sendMessage(
            `هييي!! مين سمحلك؟! 😾\nممنوع تلعب بالصلاحيات!`,
            event.threadID,
            event.messageID
          );
        return api.sendMessage(
          `» وضع الحماية مفعّل يا عسل! 🛡️✨\nحاولي مرة ثانية وبتشوفي!`,
          event.threadID,
          event.messageID
        );
      }
    }

    // إزالة إدمن
    else if (logMessageData.ADMIN_EVENT === "remove_admin") {
      if (event.author == api.getCurrentUserID()) return;
      if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;

      api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
      api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true);

      function editAdminsCallback(err) {
        if (err)
          return api.sendMessage(
            `أوه لااا! وش ناوي تسوي؟! 😠\nرجعنا كل شي مكانه يا حلو.`,
            event.threadID,
            event.messageID
          );
        return api.sendMessage(
          `» الحارسة الجميلة موجودة! ممنوع العبث بالصلاحيات! 💅🏼🛡️`,
          event.threadID,
          event.messageID
        );
      }
    }
  }
};
