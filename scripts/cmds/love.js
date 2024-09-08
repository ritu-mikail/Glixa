const axios = require("axios");
const rubishapi = global.GoatBot.config.rubishapi;

module.exports = {
  config: {
    name: 'mihi',
    aliases: ["mihi"],
    version: '3.0',
    author: 'RUBISH',
    shortDescription: 'AI CHAT',
    longDescription: {
      vi: 'Chat with simma',
      en: 'Chat with simma'
    },
    category: 'AI CHAT',
    guide: { en: `
{pn} Hi : chat with simma

{pn} teach <original word> - <response>: Teach Simsimi how to respond to the original word.

{pn} <original word>: Simsimi will respond based on the original word.

Example:

{pn} teach hello - Hi there

{pn} <original word>: Simsimi will respond based on the original word.

{pn} stats: Display statistics on the number of responses and original words.` }
  },

  onReply: async function ({ api, event }) {
    if (event.type === "message_reply") {
      const reply = event.body.toLowerCase();
      if (isNaN(reply)) {
        try {
          const { data } = await axios.get(`${rubishapi}/chat`, {
            params: { query: reply, apikey: 'rubish69' }
          });
          const responseMessage = data.response;
          await api.sendMessage(responseMessage, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: 'reply',
              messageID: info.messageID,
              author: event.senderID,
              link: responseMessage
            });
          }, event.messageID);
        } catch (error) {
          console.error(error);
        }
      }
    }
  },

  onStart: async function ({ api, args, event }) {
    const { threadID, messageID, senderID } = event;
    const [command, ...restArgs] = args;
    const tid = threadID;
    const mid = messageID;
    const uid = senderID;

    if (command === 'teach') {
      const [ask, ans] = restArgs.join(' ').split('-').map(item => item.trim());
      if (!ask || !ans) return api.sendMessage('⚠ | Both the question and response are required and should be separated by " - ".', tid, mid);

      try {
        const { data } = await axios.get(`${rubishapi}/teach`, {
          params: { query: ask, response: ans, apikey: 'rubish69' }
        });
        const responseMessage = data.message || "Successfully taught simma.";
        return api.sendMessage(responseMessage, tid, mid);
      } catch (error) {
        console.error('Error occurred while teaching', error.message);
        return api.sendMessage("I couldn't learn that. Please try again later.", tid, mid);
      }
    }

    if (command === 'stats') {
      try {
        const { data } = await axios.get(`${rubishapi}/stats`, {
          params: { apikey: 'rubish69' }
        });
        const responseMessage = data.stats || "✅ | Fetched the stats successfully.";
        api.sendMessage(responseMessage, tid);
      } catch (error) {
        console.error('Error occurred while fetching stats', error.message);
        api.sendMessage("⚠ | Failed to fetch the stats. Please try again later.", tid);
      }
    } 

    else {
      try {
        const rubish = args.join(" ").toLowerCase();
        if (!rubish) {
          api.sendMessage("Hello I'm Simma\n\nHow can I assist you?", tid, mid);
          return;
        }
        const { data } = await axios.get(`${rubishapi}/chat`, {
          params: { query: rubish, apikey: 'rubish69' }
        });
        const responseMessage = data.response;
        await api.sendMessage(responseMessage, tid, (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: senderID,
            link: responseMessage
          });
        }, mid);
      } catch (error) {
        console.error(`Failed to get an answer: ${error.message}`);
        api.sendMessage(`${error.message}.\nAn error`, tid, mid);
      }
    }
  }
};
