const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  name: "cook",
  aliases: ["co"],
  async execute(message, args) {
    message.channel
      .send(":bowl_with_spoon: Cooking...")
      .then(async (sentMessage) => {
        try {
          sentMessage.edit(":bowl_with_spoon: Cooking.");
          sentMessage.edit(":bowl_with_spoon: Cooking..");
          sentMessage.edit(":bowl_with_spoon: Cooking...");

          const msg =
            args.length > 0
              ? args[0].charAt(0).toUpperCase() + args[0].slice(1)
              : "Pasta";
          const msgFull = `${msg} cooking full recipe.\n\nStep 1.`;

          const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
          });
          const openai = new OpenAIApi(configuration);

          const cook = await openai.createCompletion("davinci", {
            prompt: msgFull,
            max_tokens: 400,
            temperature: 0.8,
            top_p: 1.0,
            stop: [".", "<|endoftext|>"],
          });

          sentMessage.edit(
            "-- Done by GPT-3 --\n```" +
              msgFull +
              cook.data.choices[0].text +
              ".```"
          );
        } catch (err) {
          sentMessage.edit(":x: Error:\n```\n" + err + "```");
          console.error(err);
        }
      });
  },
};
