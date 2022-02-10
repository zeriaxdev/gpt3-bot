const { MessageEmbed } = require("discord.js");
const mf = require("minifaker");
require("minifaker/locales/en");

module.exports = {
  name: "fakeme",
  aliases: ["fm"],
  async execute(message, args) {
    message.channel.send(":gear: Faking data...").then(async (sentMessage) => {
      try {
        sentMessage.edit(":gear: Faking data.");
        sentMessage.edit(":gear: Faking data..");
        sentMessage.edit(":gear: Faking data...");

        const fname = mf.firstName();
        const lname = mf.lastName();
        const ctry = mf.country();
        const someImg = `${mf.imageUrlFromPlaceIMG({
          width: 300,
          height: 300,
          category: "tech",
        })}?uuid=${mf.uuid.v5.URL}`;

        const fakeEmbed = new MessageEmbed()
          .setTitle(`${fname} ${lname}`)
          .setColor(mf.color())
          .setDescription(`I'm ${fname} ${lname}, and I'm from ${ctry}!`)
          .setThumbnail(someImg)
          .addFields(
            {
              name: "Phone Number",
              value: mf.phoneNumber(),
              inline: true,
            },
            {
              name: "Email",
              value: mf.email({
                firstName: fname,
                lastName: lname,
              }),
              inline: true,
            },
            {
              name: "Password",
              value: `||${mf.password()}||`,
              inline: true,
            },
            {
              name: "Address",
              value: mf.streetAddress(),
              inline: true,
            },
            {
              name: "City",
              value: mf.cityName(),
              inline: true,
            },
            {
              name: "Country",
              value: ctry,
              inline: true,
            },
            {
              name: "Domain",
              value: mf.domainUrl(),
              inline: true,
            },
            {
              name: "IP",
              value: mf.ip(),
              inline: true,
            },
            {
              name: "IPv6",
              value: mf.ipv6(),
              inline: true,
            }
          );

        sentMessage.edit({
          content: null,
          embeds: [fakeEmbed],
        });
      } catch (err) {
        sentMessage.edit(":x: Error:\n```\n" + err + "```");
        console.error(err);
      }
    });
  },
};
