const { MessageEmbed } = require("discord.js");
const cheerio = require("cheerio");
const got = (...args) => import("got").then(({ default: got }) => got(...args));
const colorThief = require("colorthief");

module.exports = {
  name: "face",
  aliases: ["f"],
  async execute(message, args) {
    message.channel
      .send(":gear: Generating a face...")
      .then(async (sentMessage) => {
        try {
          sentMessage.edit(":gear: Generating a face.");
          sentMessage.edit(":gear: Generating a face..");
          sentMessage.edit(":gear: Generating a face...");

          const url = "https://this-person-does-not-exist.com";
          const key = process.env.RAPIDAPI_KEY;

          const faceEmbed = new MessageEmbed()
            .setTitle(`AI-generated face`)
            .setURL(url)
            .setFooter(
              `Request made by: ${message.author.tag}`,
              message.author.displayAvatarURL()
            );

          got(url).then((res) => {
            const $ = cheerio.load(res.body);
            const desc = $("div.h1-text").html();
            const img = `${url + $("#avatar").attr("src")}`;

            colorThief.getColor(`${img}`).then(async (color) => {
              const imageColorHex =
                "#" + color.map((c) => Number(c).toString(16)).join("");

              faceEmbed
                .setColor(imageColorHex)
                .setDescription(desc)
                .setAuthor({
                  name: "<- This Person Does Not Exist",
                  url: url,
                  iconURL: img,
                })
                .setImage(img);

              sentMessage.edit({
                content: null,
                embeds: [faceEmbed],
              });
            });
          });
        } catch (err) {
          sentMessage.edit(":x: Error:\n```\n" + err + "```");
          console.error(err);
        }
      });
  },
};
