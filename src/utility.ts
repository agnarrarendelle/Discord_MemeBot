import axios from "axios";
import discord from "discord.js";
import subNames from "./subNames.json" assert { type: "json" };
import { getImage, getPost } from "random-reddit";

enum commands {
  meme = "meme",
  pmeme = "pmeme",
}

enum sendTimeRange{
  max = 8,
  min = 1
}

const prefix = "!";
const setUpCommandReact = async (message: discord.Message) => {
  if (!message.content.startsWith(prefix)) return;
  let command = getCommand(message.content);
  if (!(command in commands)) {
    message.channel.send("Invalid command");
    return;
  }

  let secondArgument = parseInt(getSecondArgument(message.content));
  let sendTimes = sendTimeRange.min
  if (Number.isInteger(secondArgument)) {
    sendTimes = secondArgument
  }
  if(sendTimes > sendTimeRange.max){
    message.channel.send("Maximum send times exceeded. Please enter a smaller value");
    return
  }
  if(sendTimes < sendTimeRange.min){
    message.channel.send("Please enter a positive integer less than 8");
    return
  }
await sendImgMultipleTimes(command, message, sendTimes)
};

const getCommand = (content: string): string => {
  const command = content.replace(prefix, "").split(" ")[0];
  return command;
};

const getSecondArgument = (msg: string) => {
  return msg.split(" ")[1];
};

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getRanmdomSubName = (subNames: string[]) => {
  return subNames[getRandomInt(0, subNames.length)];
};

const getSubName = (command: string) => {
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

const getAndSendImg = async (subName: string, message: discord.Message) => {
  const postUrl = await getPost(subName);
  const { title, url, subreddit, permalink } = postUrl;
  message.channel.send(`From r/${subreddit}\n${title}\nhttps://www.reddit.com/${permalink}\n${url}`);
};

const sendImgMultipleTimes = async (
  command: string,
  message: discord.Message,
  times: number
) => {
  for (let i = 0; i < times; i++) {
    let subName = getSubName(command);
    await getAndSendImg(subName, message);
  }
};

export default {
  setUpCommandReact,
};
