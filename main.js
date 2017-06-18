//adding librarys, doing some setup stuff
//TODO: Split everything up in multiple files

var numbersauth = [];
const Discord = require('discord.js');
const fs = require("fs");
var d = new Date();

var token = 0;
const srvdb = "./srvdata.json"
const authdb = "./athdata.json"
console.log("about to do it")
var authorn = fs.readFileSync(authdb, "utf8")
var ns = fs.readFileSync(srvdb, "utf8")
console.log(ns)
console.log("half done")
var numbers = JSON.parse(ns)
var numbersauth = JSON.parse(authorn)
console.log("done?")
const client = new Discord.Client();
const util = require('util');
var tokenfile = require("./token.js")
/*var tokenfile = "./token.txt"
var readarray = fs.readFileSync(tokenfile).toString().split("\n");
var token = readarray[0]*/
console.log("after reading")

var token = tokenfile.gettoken()
console.log(token)

//HTTP SERVER

const http = require('http');

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
    //Executes when the request has finished sending
    body = Buffer.concat(body).toString();
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    //var responselist = "Last message took " + timetaken + "ms to process\n\n"
    var responselist = "Pos | Server                           | Messages\n"
    for(i = 0;i < numbers.length;i++){
      //Filling up variables with some spaces
      var posnumber = i + 1
      var posnumber = posnumber + "   "
      var servernames = numbers[i].name + "                                " + "."
      //Cutting variables to fit nicely into that table
      var servernames = servernames.substr(0, 32)
      var posnumber = posnumber.substr(0, 3)

      responselist = responselist + posnumber + " | " + servernames + " | " + numbers[i].value + "\n"
    }
    responselist = responselist + "\n\nAuthor Data:\n"

    responselist = responselist + "Pos | Author                           | Messages\n"
    for(i = 0;i < numbersauth.length;i++){
      //Filling up variables with some spaces
      var posnumber = i + 1
      var posnumber = posnumber + "   "
      var authornames = numbersauth[i].name + "                                " + "."
      //Cutting variables to fit nicely into that table
      var authornames = authornames.substr(0, 32)
      var posnumber = posnumber.substr(0, 3)

      responselist = responselist + posnumber + " | " + authornames + " | " + numbersauth[i].value + "\n"
    }
    //ending response
    response.end(responselist + 'END\n');
  //Some logging stuff of the requests, can be used for debug
	/*console.log("Headers: " + headers)
	console.log("Method: " + method)
	console.log("URL: " + url)
	console.log("Body: " + body)*/

  });
}).listen(80);

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
      //console.log("server has been found")
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
    //console.log("Added to a value in array")
    numbers[srvinarray].value = numbers[srvinarray].value + 1
  }
  var numbers2 = numbers.sort(function(a, b){return b.value-a.value})
  //console.log("Sorted values (probably)")
  //console.log(numbers2)
  //console.log(numbers[srvinarray].value)
  //console.log()

  //Checking if author already exists in array
  for(i = 0;i < numbersauth.length;i++){
    if(numbersauth[i].usrid === message.author.id){
      var authorHasBeenFound = true;
      var authorinarray = i;
      //console.log("author has been found")
    }
  }

  //Adds Author to array if it hasnt been found
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

  if (message.content === 'hey marco give me a ping' && message.author.username === "marco_rennmaus | Rennmoose") {
    message.reply('pong');
  }
  if (message.content === "hey marco give me a rank" && message.author.username === "marco_rennmaus | Rennmoose") {
    var ranking = srvinarray + 1
    var total = numbers.length + 1
    console.log("giving rank")
    message.channel.send(["**" + message.guild.name + "** is currently ranked on Place **" + ranking + "** of " + total])
  }
  if (message.content === "hey marco give me the top 5" && message.author.username === "marco_rennmaus | Rennmoose") {
    var responselist = "Pos | Server                           | Messages\n"
    for(i = 0;i < 5;i++){
      var ranking = srvinarray + 1
      //Filling up variables with some spaces
      var posnumber = i + 1
      var posnumber = posnumber + "   "
      var servernames = numbers[i].name + "                                " + "."
      //Cutting variables to fit nicely into that table
      var servernames = servernames.substr(0, 32)
      var posnumber = posnumber.substr(0, 3)

      responselist = responselist + posnumber + " | " + servernames + " | " + numbers[i].value + "\n"
    }

    if(srvinarray >= 4){
      var servernames = message.guild.name + "                                "
      var servernames = servernames.substr(0, 32)
      var ranking = ranking + "   "
      var ranking = ranking.substr(0, 3)
      responselist = responselist + ranking + " | " + servernames + " | " + numbers[srvinarray].value + "\n"
    }
    message.channel.send("```" + responselist + "```")
  }

  if (message.content === "hey marco give me the top 5 without any life" && message.author.username === "marco_rennmaus | Rennmoose") {
    var responselist = "Pos | Author                           | Messages\n"
    for(i = 0;i < 5;i++){
      var ranking = authorinarray + 1
      //Filling up variables with some spaces
      var posnumber = i + 1
      var posnumber = posnumber + "   "
      var authornames = numbersauth[i].name + "                                " + "."
      //Cutting variables to fit nicely into that table
      var authornames = authornames.substr(0, 32)
      var posnumber = posnumber.substr(0, 3)

      responselist = responselist + posnumber + " | " + authornames + " | " + numbersauth[i].value + "\n"
    }

    if(authorinarray >= 5){
      var authornames = message.author.name + "                                "
      var authornames = authornames.substr(0, 32)
      var ranking = ranking + "   "
      var ranking = ranking.substr(0, 3)
      responselist = responselist + ranking + " | " + authornames + " | " + numbersauth[authorinarray].value + "\n"
    }
    message.channel.send("```" + responselist + "```")
  }
});

//Bot Token
//client.login('Insert Bot Token here');


//Selfbot Token
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
