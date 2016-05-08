import fetch from "node-fetch";
import Telegram from "node-telegram-bot-api";
import validUrl from "valid-url";
import config from "./config";

const REDDIT_URL = "https://www.reddit.com";

function createRedditUrl(subReddit) {
    return !subReddit ? `${REDDIT_URL}/.json` : `${REDDIT_URL}/r/${subReddit}.json`;
}

function queryReddit(subReddit) {
    return fetch(createRedditUrl(subReddit))
        .then((res) => res.json());
}

function createInlineResultItem(redditItem) {
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

function createInlineResults(redditJson) {
    if (redditJson.error) {
        throw new Error("Error: no subreddit found!");
    } else {
        return redditJson.data.children.map(x => createInlineResultItem(x));
    }
}

const bot = new Telegram(config.token, { polling: true });

bot.on("inline_query", (msg) => {
    queryReddit(msg.query)
        .then(redditResponse => bot.answerInlineQuery(msg.id, createInlineResults(redditResponse)))
        .catch(() => bot.answerInlineQuery(msg.id, []));
});
