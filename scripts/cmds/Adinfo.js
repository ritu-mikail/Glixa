module.exports = {
  config: {
    name: "adinfo",
    aliases: [],
    author: "Mahi-",
    version: "1.0",
    cooldowns: 0,
    role: 1,  // Admin role to ensure this feature is active at all times
    shortDescription: "Monitors if a specific user is added to the group.",
    longDescription: "Sends a special message when the specified user is added to the group.",
    category: "group",
    guide: "",
  },
  
  // Minimal onStart function to satisfy the framework
  onStart: async function () {
    return;
  },

  // Event listener function
  onEvent: async function ({ event, api }) {
    // Check if the event is 'log:subscribe', indicating someone was added to the group
    if (event.logMessageType === 'log:subscribe') {
      const addedUserIDs = event.logMessageData.addedParticipants.map(participant => participant.userFbId);

      // The specific user ID to check
      const myLordID = "100072881080249";

      // Only send a message if the specific user was added
      if (addedUserIDs.includes(myLordID)) {
        // Send the special message to the group
        const message = "Thanks for adding my lord Mahi!";
        api.sendMessage(message, event.threadID);
      }
    }
  },
};
