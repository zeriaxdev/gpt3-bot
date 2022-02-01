const OpenAI = require("openai.js");

module.exports = {
  name: "ask",
  aliases: ["a"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      try {
        sentMessage.edit(":gear: Processing.");
        sentMessage.edit(":gear: Processing..");
        sentMessage.edit(":gear: Processing...");

        const msg =
          args.length > 0 ? args.join(" ") : "What is the meaning of life?";

        const ai = new OpenAI(process.env.OPENAI_API_KEY);

        const ask = async (question) => {
          const answer = await ai.Ask(question);
          return answer;
        };

        sentMessage.edit(`Question: \`${msg}\`\nAnswer: \`${await ask(msg)}\``);
      } catch (err) {
        sentMessage.edit(":x: Error:\n```\n" + err + "```");
        console.error(err);
      }
    });
  },
};
