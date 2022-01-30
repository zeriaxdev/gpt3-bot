const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");

module.exports = {
  name: "ask",
  aliases: ["a"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg =
        args.length > 0 ? args.join(" ") : "What is the meaning of life?";

      // const configuration = new Configuration({
      //   apiKey: process.env.OPENAI_API_KEY,
      // });
      // const openai = new OpenAIApi(configuration);

      // const answer = await openai.createAnswer("davinci", {
      //   question: msg,
      //   data: [msg],
      // });

      // const json = JSON.stringify({
      //   documents: [],
      //   question: msg,
      //   search_model: "davinci",
      //   model: "davinci",
      //   examples_context: "In 2017, U.S. life expectancy was 78.6 years.",
      //   examples: [
      //     ["What is human life expectancy in the United States?", "78 years."],
      //   ],
      //   max_tokens: 100,
      //   stop: ["\n", "<|endoftext|>"],
      // });

      // const res = await axios.default.post(
      //   "https://api.openai.com/v1/answers",
      //   json,
      //   {
      //     headers: `Authorization: Bearer ${process.env.OPENAI_API_KEY}`,
      //   }
      // );

      // res.data.headers;
      message.reply("Not working yet.");
    });
  },
};
