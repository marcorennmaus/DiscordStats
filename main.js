//adding librarys, doing some setup stuff
const Discord = require('discord.js');
const fs = require("fs");

var token = 0;
const srvdb = "./srvdata.json"
console.log("about to do it")
var ns = fs.readFileSync(srvdb, "utf8")
console.log(ns)
console.log("half done")
var numbers = JSON.parse(ns)
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
  //Executes when a message is recieved
  if (message.guild == null){
    //Deactivates responding and counting in PMs, would lead to Errors otherwise
    return false;
  }
  //Logging messages in console
  console.log("[" + message.author.username + "@" + message.guild.name + "] " + message.content)

  //Checking if server already exists in array
  for(i = 0;i < numbers.length;i++){
    if(numbers[i].srvid === message.guild.id){
      var serverHasBeenFound = true;
      var srvinarray = i;
      console.log("server has been found")
    }
  }

  //Adds Server to array if it hasnt been found
  if (serverHasBeenFound != true){
    console.log("Guild ID: " + message.guild.id)
    var srvinarray = numbers.length
    numbers[numbers.length] = {srvid: message.guild.id, name: message.guild.name, value: 0}
  }

  //Increases message counter
  if (numbers[srvinarray].value != "undefined"){
    console.log("Added to a value in array")
    numbers[srvinarray].value = numbers[srvinarray].value + 1
  }
  var numbers2 = numbers.sort(function(a, b){return b.value-a.value})
  console.log("Sorted values (probably)")
  //console.log(numbers2)
  //console.log(numbers[srvinarray].value)
  //console.log()

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
      //Filling up variables with some spaces
      var posnumber = i + 1
      var posnumber = posnumber + "   "
      var servernames = numbers[i].name + "                                " + "."
      //Cutting variables to fit nicely into that table
      var servernames = servernames.substr(0, 32)
      var posnumber = posnumber.substr(0, 3)

      responselist = responselist + posnumber + " | " + servernames + " | " + numbers[i].value + "\n"
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
