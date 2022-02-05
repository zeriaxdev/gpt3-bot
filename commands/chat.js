const OpenAI = require("openai.js");

module.exports = {
  name: "chat",
  aliases: ["ch"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      try {
        sentMessage.edit(":gear: Processing.");
        sentMessage.edit(":gear: Processing..");
        sentMessage.edit(":gear: Processing...");

        const msg =
          args.length > 0 ? args.join(" ") : "Hello! My name is Mike.";

        const ai = new OpenAI(process.env.OPENAI_API_KEY);

        const chat = async (req) => {
          const res = await ai.Chat(req);
          return res;
        };

        sentMessage.edit(
          `Human says: \`${msg}\`\nAI replies: \`${await chat(msg)}\``
        );
      } catch (err) {
        sentMessage.edit(":x: Error:\n```\n" + err + "```");
        console.error(err);
      }
    });
  },
};
