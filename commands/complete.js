const { Configuration, OpenAIApi } = require("openai");
const twt = require("../twitter.js");

module.exports = {
  name: "complete",
  aliases: ["c"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg = args.length > 0 ? args.join(" ") : "";

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const completion = await openai.createCompletion("davinci", {
        prompt: msg,
        max_tokens: 400,
        temperature: 1.0,
        top_p: 0.9,
        stop: [".", "<|endoftext|>"],
      });

      sentMessage.edit(
        "-- Done by GPT-3 --\n```" +
          (msg + completion.data.choices[0].text) +
          "```"
      );
    });
  },
};
