const { MessageEmbed } = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  name: "reddit",
  aliases: ["r"],
  execute(message, args) {
    const sub = args.length > 0 ? args.join(" ") : "all";
    const url = `https://reddit.com/r/${sub}/top.json`;

    message.channel.send(":gear: Processing...").then(async (sentMessage) => {
      sentMessage.edit(":gear: Processing.");
      sentMessage.edit(":gear: Processing..");
      sentMessage.edit(":gear: Processing...");

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          const post =
            json.data.children[
              Math.floor(Math.random() * json.data.children.length)
            ].data;

          const logo =
            "https://www.redditinc.com/assets/images/site/reddit-logo.png";

          const title = post.title;
          const url = post.permalink;
          const desc = post.selftext;
          const author = post.author;
          const subreddit = post.subreddit;
          const score = post.score;
          const comments = post.num_comments;
          const image = post.url;

          const thumbnail = post.thumbnail ? post.thumbnail : logo;

          const funnyEmbed = new MessageEmbed()
            .setAuthor({
              name: "Powered by Reddit",
              url: "https://reddit.com",
              iconURL: logo,
            })
            .setTitle(title)
            .setURL(`https://reddit.com${url}`)
            .setThumbnail(
              thumbnail.includes("http")
                ? thumbnail
                : `https://i.imgur.com/${thumbnail}.png`
            )
            .setColor("#FF4500")
            .setDescription(desc ? desc : "No description available.")
            .addFields(
              {
                name: "Score",
                value: `${score} votes`,
                inline: true,
              },
              {
                name: "Comments",
                value: `${comments} comments`,
                inline: true,
              }
            )
            .setImage(image)
            .setFooter(`u/${author} from r/${subreddit}`);

          sentMessage.edit({
            content: "✅ Done!",
            embeds: [funnyEmbed],
          });
        })
        .catch(() => {
          sentMessage.edit(":x: Error.");

          if (error.code === "ENOTFOUND") {
            sentMessage.edit(":x: Could not connect to reddit.com.");
          } else {
            sentMessage.edit(":x: Error:\n```\n" + err + "```");
            console.error(err);
          }
        });
    });
  },
};
