// Packages
const {Discord, Client, Collection, Message, MessageEmbed} = require("discord.js");
const Twit = require("node-tweet-stream");
const fs = require("fs");

// Setup
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

// Clients
const t = new Twit({
    consumer_key: config.twitterConsumerKey,
    consumer_secret: config.twitterConsumerSecret,
    //app_only_auth:true,
    //access_token_key:config.twitterAccessTokenKey,
    //access_token_secret:config.twitterAccessTokenSecret
    token: config.twitterAccessTokenKey,
    token_secret: config.twitterAccessTokenSecret
});
const dClient = new Client({intents: 32767});
dClient.login(config.discordBotToken);

// Success
dClient.on('ready', () => {
    console.log(`Connected to Discord as ${dClient.user.tag}`);
});

// Tweet Listener + Post
t.on('tweet', function (tweet) {
    let media = tweet.entities.media;
    chatPost(tweet.text, tweet.user.screen_name, `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`, tweet.created_at, tweet.user.profile_image_url, media);
})
t.on('error', function (err) {
    console.log('Oh no')
})
let track = config.following;
for (var i = 0; i < track.length; i++) {
    t.follow(track[i]);
    console.log(`Following Twitter User [ID]${track[i]}`)
    console.log(`For Support please join https://discord.gg/PrGCCWpDbP`)
}


// Functions
function chatPost(content, author, url, time, authorPfp, media) {
    const message = new MessageEmbed().setTitle(config.title).setColor(config.colour).setDescription(content).setAuthor(`@${author}`, authorPfp, `https://twitter.com/${author}`).setFooter(`Twitter - ${time}`, "https://abs.twimg.com/favicons/twitter.ico").setURL(url);

    if (!!media) for (var j = 0; j < media.length; j++) message.setImage(media[j].media_url);

    for (const __channel of config.channelsToPost.map(x => dClient.channels.cache.get(x))) __channel.send({embeds: [message]});
}
