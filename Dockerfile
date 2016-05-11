FROM node:4.4.4-wheezy

RUN mkdir telegramBot/

COPY . /telegramBot

RUN cd /telegramBot && npm install

ENV NODE_ENV production

CMD ["node", "/telegramBot/main.js"]
