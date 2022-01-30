const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  name: "classify",
  aliases: ["cl"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg = args.length > 0 ? args.join(" ") : "I'm so happy!";

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);

      const response = await openai.createClassification({
        search_model: "davinci",
        model: "curie",
        examples: [
          ["A happy moment", "Positive"],
          ["I am feeling awesome", "Positive"],
          ["I am sad.", "Negative"],
          ["Screw you!", "Insult"],
          ["You suck", "Insult"],
          ["You're a clown.", "Insult"],
          ["You're trash :)", "Insult"],
          ["Punk.", "Insult"],
        ],
        query: msg,
        labels: ["Positive", "Negative", "Neutral", "Insult"],
      });

      sentMessage.edit(
        `Query: \`${msg}\`\nClassification: \`${response.data.label}\``
      );

      if (response.data.label === "Positive") {
        message.react("😄");
      } else if (response.data.label === "Negative") {
        message.react("😢");
      } else if (response.data.label === "Neutral") {
        message.react("🤔");
      } else if (response.data.label === "Insult") {
        message.react("😠");
      } else {
        message.react("❔");
      }
    });
  },
};
