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
//enum that stores all bot commands
var commands;
(function (commands) {
    commands["meme"] = "meme";
    commands["pmeme"] = "pmeme";
})(commands || (commands = {}));
//enum that records minimum and maximum numbers that the bot can fetch at one time
var sendTimeRange;
(function (sendTimeRange) {
    sendTimeRange[sendTimeRange["max"] = 8] = "max";
    sendTimeRange[sendTimeRange["min"] = 1] = "min";
})(sendTimeRange || (sendTimeRange = {}));
//all commands starts with !
const prefix = "!";
//function called when users enter any message
const setUpCommandReact = (message) => __awaiter(void 0, void 0, void 0, function* () {
    //if messages do not start with !, end the function
    if (!message.content.startsWith(prefix))
        return;
    //get the first string that users enter after !
    let command = getCommand(message.content);
    //check if the string in in commands enum, 
    //and notify the users that the commmand is invalid if not
    if (!(command in commands)) {
        message.channel.send("Invalid command");
        return;
    }
    //get the second string that users after command and try to parse it as integer
    let secondArgument = parseInt(getSecondArgument(message.content));
    //how many images will be fetched at one time
    let sendTimes = sendTimeRange.min;
    //if the second string is an integer, set snedTimes to the second string
    if (Number.isInteger(secondArgument)) {
        sendTimes = secondArgument;
    }
    //check if the sendTimes is within 1 and 8,
    //and notify users that the number is out of range if not
    if (sendTimes > sendTimeRange.max) {
        message.channel.send("Maximum send times exceeded. Please enter a smaller value");
        return;
    }
    if (sendTimes < sendTimeRange.min) {
        message.channel.send("Please enter a positive integer less than 8");
        return;
    }
    //call the function to send images k times
    yield sendImgMultipleTimes(command, message, sendTimes);
});
//parse messages entered by users and return the first string after !
const getCommand = (content) => {
    const command = content.replace(prefix, "").split(" ")[0];
    return command;
};
//split messages by space and return the second string
const getSecondArgument = (msg) => {
    return msg.split(" ")[1];
};
//generate a random integer between min and max
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
//get a random subreddit name in the array that stores subreddit names
const getRanmdomSubName = (subNames) => {
    return subNames[getRandomInt(0, subNames.length)];
};
//get a random sub name based on command enter by users
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
//make a request via random-reddit api with the sub reddit name
//and extract infomation such as post image url and link from the response
//finally, send the message that contains those information to the chat 
const getAndSendImg = (subName, message) => __awaiter(void 0, void 0, void 0, function* () {
    const postUrl = yield getPost(subName);
    const { title, url, subreddit, permalink } = postUrl;
    message.channel.send(`From r/${subreddit}\n${title}\nhttps://www.reddit.com/${permalink}\n${url}`);
});
//a function that calls getandSendImg 1 or more times based on users' request
const sendImgMultipleTimes = (command, message, times) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < times; i++) {
        let subName = getSubName(command);
        yield getAndSendImg(subName, message);
    }
});
export default {
    setUpCommandReact,
};
