module.exports.config = {
  name: "antijoin",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "يونو",
  description: "منع دخول الأعضاء الجدد مع رسائل ظريفة"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
  let data = (await Threads.getData(event.threadID)).data;
  if (data.newMember == false) return;

  // تجاهل إذا البوت هو اللي انضاف
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

  // تنفيذ الطرد إذا كانت الخاصية مفعّلة
  if (data.newMember == true) {
    let memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

    for (let idUser of memJoin) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      api.removeUserFromGroup(idUser, event.threadID, async function (err) {
        if (err) {
          data["newMember"] = false;
        } else {
          await Threads.setData(event.threadID, { data });
          global.data.threadData.set(event.threadID, data);
        }
      });
    }

    return api.sendMessage(
      `✨خاصية "منع الانضمام" مفعّلة حاليًا يا جميل💅🏼\n\nلا يمكن إضافة أعضاء جدد حتى يتم إيقاف الخاصية ❌\n\nخلي الفريق بنكهته الحلوة كذا بس، لا تخلطونا بأحد جديد! 🧁💖`,
      event.threadID
    );
  }
}
