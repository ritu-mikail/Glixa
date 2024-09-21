const axios = require('axios');

module.exports = {
  config: {
    name: "mahi",
    version: "1.0",
    author: "Mahi--",
    role: 0,
    shortDescription: "Responds to 'mahi', 'mâhî', 'høpéléss', 'easir', or 'aizen' with a random message and a random GIF",
    longDescription: "Sends a random text and a random GIF when any of the keywords 'mahi', 'mâhî', 'høpéléss', 'easir', or 'aizen' are detected in the message.",
    category: "Fun",
  },

  onStart: async function() {},

  onChat: async function({ event, message }) {
    try {
      console.log("Incoming message:", event.body);

      // List of GIF URLs
      const gifUrls = [
        "https://i.imgur.com/VHJyoSq.gif",
        "https://i.imgur.com/WmOnDUM.gif",
        "https://i.imgur.com/ABgnF4m.gif",
        "https://i.imgur.com/DBMjr4e.gif"
      ];

      // List of random texts
      const texts = [
        "𝚈𝚘𝚞'𝚛𝚎 𝚞𝚗𝚠𝚘𝚛𝚝𝚑𝚢 𝚝𝚘 𝚠𝚛𝚒𝚝𝚎 𝚕𝚘𝚛𝚍 𝚖𝚊𝚑𝚒'𝚜 𝚗𝚊𝚖𝚎",
        "𝚈𝚎𝚜, 𝚖𝚢 𝚍𝚘𝚐𝚐𝚢, 𝚋𝚊𝚛𝚔. 𝚆𝚑𝚢 𝚍𝚒𝚍 𝚢𝚘𝚞 𝚠𝚛𝚒𝚝𝚎 𝚝𝚑𝚎 𝚕𝚘𝚛𝚍'𝚜 𝚗𝚊𝚖𝚎?",
        "𝙺𝚎𝚎𝚙 𝚋𝚊𝚛𝚔𝚒𝚗𝚐.",
        "𝚆𝚑𝚢 𝚊𝚛𝚎 𝚢𝚘𝚞 𝚋𝚊𝚛𝚔𝚒𝚗𝚐?"
      ];

      // Keywords to check for
      const keywords = ["mahi", "mâhî", "høpéléss", "easir", "aizen"];

      // The user ID to exclude
      const excludedUserId = "100089286199594";

      // Check if the message contains any of the keywords (case insensitive) and if the user ID does not match the excluded one
      if (
        event.body &&
        keywords.some(keyword => event.body.toLowerCase().includes(keyword)) &&
        event.senderID !== excludedUserId
      ) {
        // Select a random GIF and text
        const randomGif = gifUrls[Math.floor(Math.random() * gifUrls.length)];
        const randomText = texts[Math.floor(Math.random() * texts.length)];

        // Prepare attachment
        const attachment = await global.utils.getStreamFromURL(randomGif);

        // Reply with the selected text and GIF
        await message.reply({
          body: randomText,
          attachment: attachment
        });

        console.log("Message sent successfully with a random text and GIF.");
      } else {
        console.log("Message ignored because the sender is excluded.");
      }
    } catch (error) {
      console.error("Error in handling message:", error);
    }
  }
};
