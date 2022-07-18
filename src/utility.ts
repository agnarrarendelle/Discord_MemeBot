import discord from "discord.js";
import subNames from "./subNames.json" assert { type: "json" };
import { getPost } from "random-reddit";

//enum that stores all bot commands
enum commands {
  meme = "meme",
  pmeme = "pmeme",
}

//enum that records minimum and maximum numbers that the bot can fetch at one time
enum sendTimeRange{
  max = 8,
  min = 1
}

//all commands starts with !
const prefix = "!";
//function called when users enter any message
const setUpCommandReact = async (message: discord.Message) => {
  //if messages do not start with !, end the function
  if (!message.content.startsWith(prefix)) return;
  //get the first string that users enter after !
  const userInput = message.content.replace(prefix, "").trim();
  const userCommands = getCommands(userInput)
  let command = userCommands(0)
  //check if the string in in commands enum, 
  //and notify the users that the commmand is invalid if not
  if (!(command in commands)) {
    message.channel.send("Invalid command");
    return;
  }

  //get the second string that users after command and try to parse it as integer
  let secondArgument = parseInt(userCommands(1));
  //how many images will be fetched at one time
  let sendTimes = sendTimeRange.min
  //if the second string is an integer, set snedTimes to the second string
  if (Number.isInteger(secondArgument)) {
    sendTimes = secondArgument
  }

  //check if the sendTimes is within 1 and 8,
  //and notify users that the number is out of range if not
  if(sendTimes > sendTimeRange.max){
    message.channel.send("Maximum send times exceeded. Please enter a smaller value");
    return
  }
  if(sendTimes < sendTimeRange.min){
    message.channel.send("Please enter a positive integer less than 8");
    return
  }
  //call the function to send images k times
await sendImgMultipleTimes(command, message, sendTimes)
};


const getCommands =(userInput:string)=>{
  const inputSplited = userInput.split(/\s+/)
  return (index:number)=>{
    return inputSplited[index]
  }
}

//parse messages entered by users and return the first string after !
const getCommand = (content: string): string => {
  const command = content.replace(prefix, "").split(/\s+/)[0];
  return command;
};

//split messages by space and return the second string
const getSecondArgument = (msg: string) => {
  return msg.split(/\s+/)[1];
};

//generate a random integer between min and max
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

//get a random subreddit name in the array that stores subreddit names
const getRanmdomSubName = (subNames: string[]) => {
  return subNames[getRandomInt(0, subNames.length)];
};


//get a random sub name based on command enter by users
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

//make a request via random-reddit api with the sub reddit name
//and extract infomation such as post image url and link from the response
//finally, send the message that contains those information to the chat 
const getAndSendImg = async (subName: string, message: discord.Message) => {
  const postUrl = await getPost(subName);
  const { title, url, subreddit, permalink } = postUrl;
  message.channel.send(`From r/${subreddit}\n${title}\nhttps://www.reddit.com/${permalink}\n${url}`);
};


//a function that calls getandSendImg 1 or more times based on users' request
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
