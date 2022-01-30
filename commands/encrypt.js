const crypto = require("crypto");
const { MessageEmbed } = require("discord.js");

const sha256 = require("crypto-js/sha256");
const hmacSHA512 = require("crypto-js/hmac-sha512");
const Base64 = require("crypto-js/enc-base64");

module.exports = {
  name: "encrypt",
  aliases: ["e"],
  async execute(message, args, client) {
    const msg = !args[0]
      ? "Test Message!"
      : args.length > 5000
      ? args.join(" ").slice(0, 5000)
      : args.join(" ");

    const nonce = Math.floor(Math.random() * 100000);
    const path = "string";
    const privateKey = message.author.id;
    const hashDigest = sha256(nonce + message);
    const hmacDigest = Base64.stringify(
      hmacSHA512(path + hashDigest, privateKey)
    );

    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = cipher.update(msg, "utf8", "hex");
    const encryptedFinal = encrypted + cipher.final("hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = decipher.update(encryptedFinal, "hex", "utf8");
    const decryptedFinal = decrypted + decipher.final("utf8");

    const embed = new MessageEmbed({
      author: {
        name: message.author.username,
        icon_url: message.author.displayAvatarURL(),
      },
      title: "Encrypted Message",
      fields: [
        {
          name: "Original Message",
          value: msg,
          inline: false,
        },
        {
          name: "Hashed? Message",
          value: encryptedFinal,
          inline: true,
        },
        {
          name: "Dehashed? Message",
          value: decryptedFinal,
          inline: true,
        },
        {
          name: "HMAC",
          value: hmacDigest,
        },
      ],
      color: "BLURPLE",
      timestamp: new Date(),
      thumbnail: {
        url: message.author.displayAvatarURL(),
      },
    });

    message.channel.send({
      embeds: [embed],
    });
  },
};
