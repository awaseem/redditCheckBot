import fetch from "node-fetch";
import Telegram from "node-telegram-bot-api";
import config from "./config";

const REDDIT_URL = "https://www.reddit.com";

function createRedditUrl(subReddit) {
    return !subReddit ? `${REDDIT_URL}/.json` : `${REDDIT_URL}/r/${subReddit}.json`;
}

function queryReddit(subReddit) {
    return fetch(createRedditUrl(subReddit))
        .then((res) => res.json());
}

function createInlineResults(redditItem) {
    const redditItemData = redditItem.data;
    return {
        type: "article",
        id: redditItemData.id,
        title: redditItemData.title,
        input_message_content: {
            message_text: redditItemData.url,
        },
    };
}

const bot = new Telegram(config.token, { polling: true });

bot.on("inline_query", (msg) => {
    queryReddit(msg.query)
        .then((json) => {
            const inlineResults = json.data.children.map(x => createInlineResults(x));
            console.log(inlineResults);
            return bot.answerInlineQuery(msg.id, inlineResults);
        })
        .then(data => console.log(data))
        .catch((err) => console.error(err));
});
