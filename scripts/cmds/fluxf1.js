const axios = require('axios');
 
module.exports = {
  config: {
    name: "fluxfl",
    aliases: ["ff"],
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    shortDescription: "Image generator from Fluxfl API",
    longDescription: "",
    category: "ai-generated",
    guide: {
      en: "{pn} <prompt> --ar 1:1 --model 2"
    }
  },
 
  onStart: async function ({ message, args }) {
    let prompt = args.join(" ");
    let aspectRatio = "1:1";
    let model = "2";
 
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--ar" && args[i + 1]) {
        aspectRatio = args[i + 1];
      }
      if (args[i] === "--model" && args[i + 1]) {
        model = args[i + 1];
      }
    }
 
    try {
      const apiUrl = `https://www.samirxpikachu.run.place/fluxfl?prompt=${encodeURIComponent(prompt)}&ratio=${aspectRatio}&model=${model}`;
      const imageStream = await global.utils.getStreamFromURL(apiUrl);
 
      if (!imageStream) {
        return message.reply("join for support https://t.me/Architectdevs.");
      }
      
      return message.reply({
        body: '',
        attachment: imageStream
      });
    } catch (error) {
      console.error(error);
      return message.reply("Failed join .https://t.me/Architectdevs for support");
    }
  }
};
 
