import assert from "assert";
import { createRedditUrl, createInlineResultItem, createInlineResults } from "../src/bot";

const redditResponse = {
    data: {
        children: [
            {
                data: {
                    id: "1",
                    title: "test",
                    thumbnail: "not valid url",
                    url: "www.someurl.com/image.jpeg",
                },
            },
            {
                data: {
                    id: "1",
                    title: "test",
                    thumbnail: "http://www.someurl.com/image.jpeg",
                    url: "www.someurl.com/image.jpeg",
                },
            },
        ],
    },
};

describe("redditCheckBot", () => {
    describe("#createRedditUrl()", () => {
        it("should return front page url if no subreddit if given", () => {
            assert.equal(createRedditUrl(), "https://www.reddit.com/.json");
        });

        it("should return subreddit url if passed in", () => {
            assert.equal(createRedditUrl("test"), "https://www.reddit.com/r/test.json");
        });
    });

    describe("#createInlineResultItem", () => {
        it("should return proper inline result item with invalid url", () => {
            const expectedResults = {
                type: "article",
                id: "1",
                title: "test",
                thumb_url: undefined,
                input_message_content: {
                    message_text: "www.someurl.com/image.jpeg",
                },
            };
            assert.deepEqual(expectedResults,
                    createInlineResultItem(redditResponse.data.children[0]));
        });

        it("should return proper inline result item with valid url", () => {
            const expectedResults = {
                type: "article",
                id: "1",
                title: "test",
                thumb_url: "http://www.someurl.com/image.jpeg",
                input_message_content: {
                    message_text: "www.someurl.com/image.jpeg",
                },
            };
            assert.deepEqual(expectedResults,
                    createInlineResultItem(redditResponse.data.children[1]));
        });
    });

    describe("#createInlineResults", () => {
        it("should throw an error when error property on reddit json response exists", () => {
            assert.throws(() => createInlineResults({ error: "404" }));
        });

        it("should return an array of results based on the incoming reddit json", () => {
            const expectedResults = [
                {
                    type: "article",
                    id: "1",
                    title: "test",
                    thumb_url: undefined,
                    input_message_content: {
                        message_text: "www.someurl.com/image.jpeg",
                    },
                },
                {
                    type: "article",
                    id: "1",
                    title: "test",
                    thumb_url: "http://www.someurl.com/image.jpeg",
                    input_message_content: {
                        message_text: "www.someurl.com/image.jpeg",
                    },
                },
            ];
            assert.deepEqual(expectedResults, createInlineResults(redditResponse));
        });
    });
});
