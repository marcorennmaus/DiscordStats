//adding librarys, doing some setup stuff
//TODO: Split everything up in multiple files

var d = new Date();
var vnum = "0.5"
var numbersauth = [];
const Discord = require('discord.js');
const fs = require("fs");
const http = require('http');
const client = new Discord.Client();
const httpmain = require("./http/httpmain.js")
const util = require('util');

const discordcmds = require("./discord/cmdsmain.js")
const cat = "./categories.json"
const srvdb = "./srvdata2.json"
const authdb = "./athdata.json"
var tokenfile = require("./token.js")
var authorn = fs.readFileSync(authdb, "utf8")
var ns = fs.readFileSync(srvdb, "utf8")
var catdb = fs.readFileSync(cat, "utf8")
var numbers = JSON.parse(ns)
var numbersauth = JSON.parse(authorn)
var categorydb = JSON.parse(catdb)
var tokenfile = require("./token.js")


//HTTP SERVER


http.createServer(function(request, response) {

  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];

  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    httpmain.react2response(request, response, vnum, numbers, numbersauth, categorydb)
  //Some logging stuff of the requests, can be used for debug
	console.log("Headers: " + headers)
	console.log("Method: " + method)
	console.log("URL: " + url)
	console.log("Body: " + body)

  });
}).listen(81);

//DISCORD PART

//Executes when the bot is logged into Discord
client.on('ready', () => {
  console.log('Bot should now be ready');
});

client.on('message', message => {
  var d = new Date();
  var stdate = d.getTime();
  //Executes when a message is recieved
  if (message.guild == null){
    //Deactivates responding and counting in PMs, would lead to Errors otherwise
    return false;
  }
  //Logging messages in console

  //Checking if server already exists in array
  for(i = 0;i < numbers.length;i++){
    if(numbers[i].srvid === message.guild.id){
      var serverHasBeenFound = true;
      var srvinarray = i;
    }
  }

  //Adds Server to array if it hasnt been found
  if (serverHasBeenFound != true){
    console.log("Added new server to ranking list")
    console.log("Guild ID: " + message.guild.id)
    console.log("Guild Name: " + message.guild.name)
    var srvinarray = numbers.length
    numbers[numbers.length] = {srvid: message.guild.id, name: message.guild.name, value: 0}
  }

  //Increases message counter
  if (numbers[srvinarray].value != "undefined"){
    numbers[srvinarray].value = numbers[srvinarray].value + 1
  }
  var numbers2 = numbers.sort(function(a, b){return b.value-a.value})

  //Checking if author already exists in array
  for(i = 0;i < numbersauth.length;i++){
    if(numbersauth[i].usrid === message.author.id){
      var authorHasBeenFound = true;
      var authorinarray = i;
    }
  }

  //Adds Author to array if they havent been found
  if (authorHasBeenFound != true){
    console.log("Added new author to ranking list")
    console.log("Author ID: " + message.author.id)
    console.log("Author Name: " + message.author.name)
    console.log("Guild Name: " + message.guild.name)
    var authorinarray = numbersauth.length
    numbersauth[numbersauth.length] = {usrid: message.author.id, name: message.author.username, value: 0}
  }
//console.log("authorinarray: " + authorinarray)

  //Increases message counter
  if (numbersauth[authorinarray].value != "undefined"){
    //console.log("Added to a value in array")
    numbersauth[authorinarray].value = numbersauth[authorinarray].value + 1
  }

  var numbersauth2 = numbersauth.sort(function(a, b){return b.value-a.value})
//  console.log("Sorted values (probably)-auth")

  /*console.log("+++++ SERVER ARRAY +++++")
  console.log(numbers)
  console.log("+++++ USER ARRAY +++++")
  console.log(numbersauth)*/

  var d = new Date();
  var endate = d.getTime();
  //console.log(endate + ":" + stdate)
  var timetaken = endate - stdate
  console.log("[" + timetaken + "ms][]" + srvinarray + "@" + authorinarray + "][" + message.author.username + "@" + message.guild.name + "] " + message.content)

  discordcmds.react2message(message, numbers, numbersauth, categorydb, srvinarray, authorinarray)

});


//Selfbot Token
var token = tokenfile.gettoken()
console.log(token)
client.login(token);

setInterval(function(){
  var tobesaved = JSON.stringify(numbers, 0, 1)
fs.writeFile(srvdb, tobesaved);
}, 30000);

setInterval(function(){
  var tobesaved2 = JSON.stringify(numbersauth, 0, 1)
fs.writeFile(authdb, tobesaved2);
}, 30000);
