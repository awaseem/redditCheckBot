import fetch from "node-fetch";
import Telegram from "node-telegram-bot-api";
import validUrl from "valid-url";
import config from "nconf";

// Either use enviroment variables or a config file for telegram token!
config.env().file({ file: "config.json" });

const REDDIT_URL = "https://www.reddit.com";

const bot = new Telegram(config.get("token"), { polling: true });
/**
 * Create url to obtain json data from Reddit
 * @param  {String} subReddit The subreddit you wish to obtain the data from
 * @return {String}           Url with subreddit added or default front page with no subreddit
 */
export function createRedditUrl(subReddit) {
    return !subReddit ? `${REDDIT_URL}/.json` : `${REDDIT_URL}/r/${subReddit}.json`;
}

/**
 * Query reddit via get request and provide json response
 * @param  {String} subReddit The subreddit you wish to query
 * @return {Promise}          Promise thats pending for a respone via the GET request
 */
function queryReddit(subReddit) {
    return fetch(createRedditUrl(subReddit))
        .then((res) => res.json());
}

/**
 * Create Inline result Item for telegram response
 * @param  {Object} redditItem Reddit child with all information about a post
 * @return {Object}            Telegram inline formated result
 */
export function createInlineResultItem(redditItem) {
    const redditItemData = redditItem.data;
    return {
        type: "article",
        id: redditItemData.id,
        title: redditItemData.title,
        thumb_url: validUrl.isUri(redditItemData.thumbnail) ? redditItemData.thumbnail : undefined,
        input_message_content: {
            message_text: redditItemData.url,
        },
    };
}

/**
 * Create inline result array for telegram response
 * @param  {Object} redditJson Reddit json response
 * @return {Array of Objects}  Inline result items within an array
 */
export function createInlineResults(redditJson) {
    if (redditJson.error) {
        throw new Error("Error: no subreddit found!");
    } else {
        return redditJson.data.children.map(x => createInlineResultItem(x));
    }
}

// Listener for telegram bot
bot.on("inline_query", (msg) => {
    queryReddit(msg.query)
        .then(redditResponse => bot.answerInlineQuery(msg.id, createInlineResults(redditResponse)))
        .catch(() => bot.answerInlineQuery(msg.id, []));
});
