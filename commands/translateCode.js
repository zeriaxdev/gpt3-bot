const OpenAI = require("openai.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "translate-code",
  aliases: ["trc"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg = args.length > 0 ? args.join(" ") : 'print("Hello World!")';
      const ai = new OpenAI(process.env.OPENAI_API_KEY);

      const translateCode = async (langFrom, langTo, code) => {
        const translation = await ai.Translate(langFrom, langTo, code);
        return translation;
      };

      const langToList = [
        "Java",
        "JavaScript",
        "C",
        "C++",
        "C#",
        "Go",
        "Rust",
        "Haskell",
      ];

      const langFrom = "Python";
      const langTo = langToList[Math.floor(Math.random() * langToList.length)];

      const trEmbed = new MessageEmbed()
        .setAuthor({
          name: "OpenAI",
          url: "https://openai.com",
        })
        .setColor("BLURPLE")
        .setTitle(`${langFrom} => ${langTo}`)
        .setDescription(
          "```" + (await translateCode(langFrom, langTo, msg)?.length)
            ? await translateCode(langFrom, langTo, msg)
            : "No translation available :(" + ""
        )
        .setFooter(
          `Request made by: ${message.author.tag}`,
          message.author.displayAvatarURL()
        );

      sentMessage.edit({ embeds: [trEmbed] });
    });
  },
};
