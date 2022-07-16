var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import subNames from "./subNames.json" assert { type: "json" };
import { getPost } from "random-reddit";
var commands;
(function (commands) {
    commands["meme"] = "meme";
    commands["pmeme"] = "pmeme";
})(commands || (commands = {}));
var sendTimeRange;
(function (sendTimeRange) {
    sendTimeRange[sendTimeRange["max"] = 8] = "max";
    sendTimeRange[sendTimeRange["min"] = 1] = "min";
})(sendTimeRange || (sendTimeRange = {}));
const prefix = "!";
const setUpCommandReact = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.content.startsWith(prefix))
        return;
    let command = getCommand(message.content);
    if (!(command in commands)) {
        message.channel.send("Invalid command");
        return;
    }
    let secondArgument = parseInt(getSecondArgument(message.content));
    let sendTimes = sendTimeRange.min;
    if (Number.isInteger(secondArgument)) {
        sendTimes = secondArgument;
    }
    if (sendTimes > sendTimeRange.max) {
        message.channel.send("Maximum send times exceeded. Please enter a smaller value");
        return;
    }
    if (sendTimes < sendTimeRange.min) {
        message.channel.send("Please enter a positive integer less than 8");
        return;
    }
    yield sendImgMultipleTimes(command, message, sendTimes);
});
const getCommand = (content) => {
    const command = content.replace(prefix, "").split(" ")[0];
    return command;
};
const getSecondArgument = (msg) => {
    return msg.split(" ")[1];
};
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
const getRanmdomSubName = (subNames) => {
    return subNames[getRandomInt(0, subNames.length)];
};
const getSubName = (command) => {
    let subName = "";
    switch (command) {
        case commands.meme:
            subName = getRanmdomSubName(subNames.memeSubs);
            break;
        case commands.pmeme:
            subName = getRanmdomSubName(subNames.programmingMemeSubs);
            break;
        default:
            break;
    }
    return subName;
};
const getAndSendImg = (subName, message) => __awaiter(void 0, void 0, void 0, function* () {
    const postUrl = yield getPost(subName);
    const { title, url, subreddit, permalink } = postUrl;
    message.channel.send(`From r/${subreddit}\n${title}\nhttps://www.reddit.com/${permalink}\n${url}`);
});
const sendImgMultipleTimes = (command, message, times) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < times; i++) {
        let subName = getSubName(command);
        yield getAndSendImg(subName, message);
    }
});
export default {
    setUpCommandReact,
};
