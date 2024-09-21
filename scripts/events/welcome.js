const { getTime } = global.utils;
const axios = require('axios');
const fs = require('fs');
const path = require('path');

if (!global.temp.welcomeEvent)
    global.temp.welcomeEvent = {};

module.exports = {
    config: {
        name: "welcome",
        version: "1.7",
        author: "NTKhang | Kaizenji",//modified by kaizenji
        category: "events"
    },

    langs: {
        vi: {
            session1: "sáng",
            session2: "trưa",
            session3: "chiều",
            session4: "tối",
            welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
            multiple1: "bạn",
            multiple2: "các bạn",
            defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
        },
        en: {
            session1: "𝗆𝗈𝗋𝗇𝗂𝗇𝗀",
            session2: "𝗇𝗈𝗈𝗇",
            session3: "𝖺𝖿𝗍𝖾𝗋𝗇𝗈𝗈𝗇",
            session4: "𝖾𝗏𝖾𝗇𝗂𝗇𝗀",
            welcomeMessage: "» 𝖡𝖮𝖳 𝖢𝖮𝖭𝖭𝖤𝖢𝖳𝖤𝖣 ✅\n\n» 𝖳𝗁𝖺𝗇𝗄 𝗒𝗈𝗎 𝖿𝗈𝗋 𝗂𝗇𝗏𝗂𝗍𝗂𝗇𝗀 𝗆𝖾 𝗍𝗈 𝗍𝗁𝖾 𝗀𝗋𝗈𝗎𝗉!\n» 𝖡𝗈𝗍 𝗉𝗋𝖾𝖿𝗂𝗑: [ %1 ]\n» 𝖳𝗈 𝗏𝗂𝖾𝗐 𝗍𝗁𝖾 𝗅𝗂𝗌𝗍 𝗈𝖿 𝖼𝗈𝗆𝗆𝖺𝗇𝖽𝗌, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗍𝗒𝗉𝖾: %1𝗁𝖾𝗅𝗉\n» 𝖴𝗌𝖾 %1𝖼𝖺𝗅𝗅𝖺𝖽 𝖿𝗈𝗋 𝖺𝗇𝗒 𝗋𝖾𝗉𝗈𝗋𝗍.\n\n𝖣𝖾𝗏: https://www.facebook.com/profile.php?id=100089286199594",
            multiple1: "𝗒𝗈𝗎",
            multiple2: "𝗒𝗈𝗎 𝗀𝗎𝗒𝗌",
            defaultWelcomeMessage: `𝖧𝖾𝗅𝗅𝗈, {userNameTag}.\n𝖶𝖾𝗅𝗈𝗆𝖾 {multiple} 𝗍𝗈 𝗍𝗁𝖾 𝖼𝗁𝖺𝗍 𝗀𝗋𝗈𝗎𝗉: {boxName}\n 𝖧𝖺𝗏𝖾 𝖺 𝗇𝗂𝖼𝖾 {session} ♡⁠(⁠˃͈⁠ ⁠દ⁠ ⁠˂͈⁠ ⁠༶⁠ ⁠)`
        }
    },

    onStart: async ({ threadsData, message, event, api, getLang }) => {
        if (event.logMessageType == "log:subscribe")
            return async function () {
                const hours = getTime("HH");
                const { threadID } = event;
                const { nickNameBot } = global.GoatBot.config;
                const prefix = global.utils.getPrefix(threadID);
                const dataAddedParticipants = event.logMessageData.addedParticipants;

                if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
                    if (nickNameBot)
                        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());

                    // IF THE BOT ADD TO GC
                    const imgUrl = 'https://i.imgur.com/FqLZgKm.mp4'; // Replace this link
                    const imgPath = path.resolve(__dirname, 'welcome.jpg');
                    const writer = fs.createWriteStream(imgPath);

                    const response = await axios({
                        url: imgUrl,
                        method: 'GET',
                        responseType: 'stream'
                    });

                    response.data.pipe(writer);

                    writer.on('finish', async () => {
                        const form = {
                            body: getLang("welcomeMessage", prefix),
                            attachment: fs.createReadStream(imgPath)
                        };
                        return message.send(form);
                    });

                    writer.on('error', (error) => {
                        console.error("Error downloading image:", error);
                    });

                    return;
                }

                if (!global.temp.welcomeEvent[threadID])
                    global.temp.welcomeEvent[threadID] = {
                        joinTimeout: null,
                        dataAddedParticipants: []
                    };

                global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
                clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

                global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
                    const threadData = await threadsData.get(threadID);
                    if (threadData.settings.sendWelcomeMessage == false)
                        return;
                    const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
                    const dataBanned = threadData.data.banned_ban || [];
                    const threadName = threadData.threadName;
                    const userName = [],
                        mentions = [];
                    let multiple = false;

                    if (dataAddedParticipants.length > 1)
                        multiple = true;

                    for (const user of dataAddedParticipants) {
                        if (dataBanned.some((item) => item.id == user.userFbId))
                            continue;
                        userName.push(user.fullName);
                        mentions.push({
                            tag: user.fullName,
                            id: user.userFbId
                        });
                    }

                    if (userName.length == 0) return;

                    let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;
                    const form = {
                        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
                    };

                    welcomeMessage = welcomeMessage
                        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
                        .replace(/\{boxName\}|\{threadName\}/g, threadName)
                        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
                        .replace(/\{session\}/g, hours <= 10 ? getLang("session1") :
                            hours <= 12 ? getLang("session2") :
                                hours <= 18 ? getLang("session3") :
                                    getLang("session4")
                        );

                    form.body = welcomeMessage;

                    // IF ADD NEW MEMBERS
                    const imgUrl = 'https://i.imgur.com/s1exIuT.gif'; // Replace this link
                    const imgPath = path.resolve(__dirname, 'default-welcome.jpg');
                    const writer = fs.createWriteStream(imgPath);

                    const response = await axios({
                        url: imgUrl,
                        method: 'GET',
                        responseType: 'stream'
                    });
                    response.data.pipe(writer);

                    writer.on('finish', async () => {
                        form.attachment = fs.createReadStream(imgPath);
                        message.send(form);
                    });

                    writer.on('error', (error) => {
                        console.error("Error downloading image:", error);
                    });

                    delete global.temp.welcomeEvent[threadID];
                }, 1500);
            };
    }
};
