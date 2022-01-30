module.exports = {
  name: "tts",
  aliases: ["t"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg = args.length > 0 ? args.join(" ") : "I'm happy!";

      const url = `https://text-to-speech-demo.ng.bluemix.net/api/v3/synthesize?text=${msg}&download=true&accept=audio%2Fmp3`;

      sentMessage.edit({
        files: [
          {
            attachment: `${url}`,
            name: `rec-${new Date(Date.now())
              .toLocaleTimeString("en-FI", {
                second: "numeric",
                minute: "numeric",
                hour: "numeric",
              })
              .replace(/\./g, "-")}.mp3`,
          },
        ],
        content: `Content: \`${msg}\`\nAt: \`${new Date(
          Date.now()
        ).toLocaleDateString("en-FI", {
          second: "numeric",
          minute: "numeric",
          hour: "numeric",
          weekday: "short",
          month: "long",
          year: "numeric",
        })}\``,
      });
    });
  },
};
