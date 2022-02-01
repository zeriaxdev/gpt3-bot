const OpenAI = require("openai.js");
const { MessageEmbed } = require("discord.js");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "translate-code",
  aliases: ["trc"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      try {
        sentMessage.edit(":gear: Processing.");
        sentMessage.edit(":gear: Processing..");
        sentMessage.edit(":gear: Processing...");

        const msg = args.length > 0 ? args.join(" ") : 'print("Hello World!")';
        const ai = new OpenAI(process.env.OPENAI_API_KEY);

        const translateCode = async (langFrom, langTo, code) => {
          const translation = await ai.TranslateCode(langFrom, langTo, code);
          return translation;
        };

        const langToList = [
          "Java",
          "JavaScript",
          "C",
          "CPlusPlus",
          "CSharp",
          "Go",
          "Rust",
          "PHP",
          "Perl",
          "Pascal",
          "Bash",
        ];

        const langFrom = "Python";
        const langTo =
          langToList[Math.floor(Math.random() * langToList.length)];

        const svg = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${langTo.toLowerCase()}/${langTo.toLowerCase()}-original.svg`;

        const trEmbed = new MessageEmbed()
          .setAuthor({
            name: "OpenAI",
            url: "https://openai.com",
          })
          .setColor("BLURPLE")
          .setTitle(`${langFrom} -> ${langTo}`)
          .setDescription(
            "```" +
              `${langTo.toLowerCase()}\n` +
              (await translateCode(langFrom, langTo, msg)) +
              "\n```"
          )
          .setFooter(
            `Request made by: ${message.author.tag}`,
            message.author.displayAvatarURL()
          );

        sentMessage.edit({
          content: "✅ Done!",
          embeds: [trEmbed],
        });
      } catch (err) {
        sentMessage.edit(":x: Error:\n```\n" + err + "```");
        console.error(err);
      }
    });
  },
};
