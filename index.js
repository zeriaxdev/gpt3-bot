const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const rest = require("./include/rest.js");
const { Rest } = require("./include/rest.js");
const dotenv = require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const mongoose = require("mongoose");
const filter = require("leo-profanity");

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
client.commands = new Discord.Collection();

// Take commands
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/` + file);
  client.commands.set(command.name, command);
}

// Cooldowns
const cooldowns = new Discord.Collection();

// On Ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  fetch("https://api.yomomma.info")
    .then((res) => res.json())
    .then((json) => {
      client.user.setPresence({
        activities: [
          {
            name: `a funny joke: ${
              json.joke.includes("mamma")
                ? json.joke.replace("mamma", "momma")
                : json.joke
            }`,
            type: "WATCHING",
            url: `https://api.yomomma.info`,
          },
        ],
      });
    });
});

// mongoose
//   .connect(process.env.MONGODB_SRV, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to the DiscordJS Database!");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// On Message
client.on("messageCreate", async (message) => {
  // const profileModel = require("./models/profileSchema.js");
  const badWords = filter.list();

  const badWordsFind = !!badWords.find((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i"); // if the phrase is not alphanumerical,
    return regex.test(message.content);
  });

  if (badWordsFind) {
    const ip = `${Math.floor(Math.random() * 255)}.${
      Math.floor(Math.random() * 255) + 1
    }.${Math.floor(Math.random() * 255) + 1}.${
      Math.floor(Math.random() * 255) + 1
    }`;

    fetch(`http://ip-api.com/json/${ip}`)
      .then((res) => res.json())
      .then((json) => {
        let ipEmbed = new Discord.MessageEmbed()
          .setTitle("Swearing is not allowed!")
          .setURL(`https://ipinfo.io/${ip}`)
          .setColor("RED")
          .setDescription(
            `**Your message**: \`${message.content}\`\nDon't use bad words!\n\n**${json.city}**, **${json.country}**\n${json.query}`
          )
          .setImage(`https://countryflagsapi.com/png/${json.countryCode}`);
        message.author.send({
          embeds: [ipEmbed],
        });

        client.channels.cache
          .get("937364789234139196")
          .send(`<@${message.author.id}> just swore!`);
      });
  }

  const user = message.mentions.members.first() || message.member;

  // let profileData;
  // try {
  //   profileData = await profileModel.findOne({
  //     userID: message.author.id,
  //   });
  //   if (!profileData) {
  //     let profile = await profileModel.create({
  //       name: message.author.tag,
  //       userID: message.author.id,
  //       serverName: message.guild.name,
  //       serverID: message.guild.id,
  //       coins: 0,
  //       warns: 0,
  //     });
  //     profile.save();
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // let profileDataUser;
  // try {
  //   profileDataUser = await profileModel.findOne({
  //     userID: user.user.id,
  //   });
  //   if (!profileDataUser) {
  //     let profileUser = await profileModel.create({
  //       name: user.user.username + user.user.discriminator,
  //       userID: user.id,
  //       serverName: message.guild.name,
  //       serverID: message.guild.id,
  //       coins: 0,
  //       warns: 0,
  //     });
  //     profileUser.save();
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  // if (!profileData) {
  //   let profileUser = await profileModel.create({
  //     name: user.user.username + user.user.discriminator,
  //     userID: user.id,
  //     serverName: message.guild.name,
  //     serverID: message.guild.id,
  //     coins: 0,
  //   });
  //   profileUser.save();
  // }

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // If command exist
  if (!command) return;

  // Check if command can be executed in DM
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check if args are required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Check if user is in cooldown
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      // If user is in cooldown
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
      command.execute(
        message,
        args,
        rest,
        client
        // profileData,
        // profileDataUser
      );
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  }
});

client.on("typingStart", (user) => {
  console.log(`${user.user.username} is typing`);
});

client.login(config.token);
