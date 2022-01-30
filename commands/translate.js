const OpenAI = require("openai.js");
const { getName, overwrite } = require("country-list");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "translate",
  aliases: ["tr"],
  async execute(message, args) {
    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      const msg =
        args.length > 0 ? args.join(" ") : "Hello! How are you doing today?";
      const ai = new OpenAI(process.env.OPENAI_API_KEY);

      const translate = async (langFrom, langTo, text) => {
        const translation = await ai.Translate(langFrom, langTo, text);
        return translation;
      };

      overwrite([
        {
          code: "GB",
          name: "United Kingdom",
        },
      ]);

      const langToList = [
        "ES",
        "FR",
        "RU",
        "FI",
        "IT",
        "SE",
        "DE",
        "NO",
        "PL",
        "DK",
      ];

      const langFrom = "GB";
      const langTo = langToList[Math.floor(Math.random() * langToList.length)];

      const trEmbed = new MessageEmbed()
        .setAuthor({
          name: "OpenAI",
          url: "https://openai.com",
        })
        .setColor("BLURPLE")
        .addFields(
          {
            name: `:flag_${langFrom.toLowerCase()}:  ${getName(langFrom)}`,
            value: `\`${msg}\``,
            inline: false,
          },
          {
            name: `:flag_${langTo.toLowerCase()}:  ${getName(langTo)}`,
            value: `\`${
              (await translate(langFrom, langTo, msg)?.length)
                ? await translate(langFrom, langTo, msg)
                : "No translation available :("
            }\``,
            inline: false,
          }
        )
        .setFooter(
          `Request made by: ${message.author.tag}`,
          message.author.displayAvatarURL()
        );

      sentMessage.edit({ embeds: [trEmbed] });
    });
  },
};
