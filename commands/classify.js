const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  name: "classify",
  aliases: ["cl"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      try {
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
            ["A happy moment", "Happiness"],
            ["I am feeling awesome", "Happiness"],
            ["I am sad.", "Sadness"],
            ["No one likes me.", "Sadness"],
            ["Ew, bugs!", "Disgust"],
            ["Spiders are terrible.", "Disgust"],
            ["Help!", "Fear"],
            ["Oh no! A spider!", "Fear"],
            ["God damn it! I spilled my milk!", "Anger"],
            ["Shit, I hate you!", "Anger"],
            ["Where did my socks go?!", "Anger"],
            ["Oh my!", "Surpise"],
            ["What?!", "Surprise"],
            ["Shit.", "#%!&@"],
            ["Fuck!", "#%!&@"],
            [
              `${/^(0[1-9]|1[012])[-/.](0[1-9]|[12][0-9]|3[01])[-/.][0-9]{4}$/}`,
              "?",
            ],
          ],
          query: msg,
          labels: [
            "Happiness",
            "Sadness",
            "Disgust",
            "Fear",
            "Anger",
            "Surprise",
            "#%!&@",
            "?",
          ],
        });

        const classEmoji = () => {
          if (response.data.label === "Happiness") {
            return "😄";
          } else if (response.data.label === "Sadness") {
            return "😢";
          } else if (response.data.label === "Disgust") {
            return "🤢";
          } else if (response.data.label === "Fear") {
            return "😨";
          } else if (response.data.label === "Anger") {
            return "😠";
          } else if (response.data.label === "Surprise") {
            return "😯";
          } else if (response.data.label === "#%!&@") {
            return "🤬";
          } else {
            return "❔";
          }
        };

        sentMessage.edit(
          `Query: \`${msg}\`\nClassification: ${classEmoji()} \`${
            response.data.label
          }\``
        );

        message.react(classEmoji());
      } catch (err) {
        sentMessage.edit(":x: Error:\n```\n" + err + "```");
        console.error(err);
      }
    });
  },
};
