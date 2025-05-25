module.exports.config = {
    name: "غادر",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "يونو",
    description: "",
    commandCategory: "ادمن",
    usages: "غادر",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
        if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
        if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
}
