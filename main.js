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
const mysql = require("mysql");

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
var mysqldata = require("./mysqllogin.js");
var mysqlhost = mysqldata.hostname()
var mysqluser = mysqldata.useracc()
var mysqlpass = mysqldata.passwrd()
var sqlsrvdailycount = 3
var chartjsfile = "./node_modules/chart.js/dist/Chart.js"

var mysqlcon = mysql.createConnection({
  host: mysqlhost,
  user: mysqluser,
  password: mysqlpass,
  database: "discordstats"
});

/*mysqlcon.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  mysqlcon.query("CREATE DATABASE discordstats", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    console.log(result)
  });
});*/

//HTTP SERVER


http.createServer(function(request, response) {
  var chartjs = fs.readFileSync(chartjsfile, "utf8")
  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];

  request.on('error', function(err) {
    console.error(err);
  }).on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    httpmain.react2response(request, response, vnum, numbers, numbersauth, categorydb, fs, chartjs, mysql, mysqlcon)
  //Some logging stuff of the requests, can be used for debug
	console.log("Headers: " + headers)
	console.log("Method: " + method)
	console.log("URL: " + url)
	console.log("Body: " + body)

  });
}).listen(80);

//DISCORD PART
console.log("with everything")
mysqlcon.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  mysqlcon.query("SELECT * FROM discordstats.guild_204611492010524672;", function (err, result){
    if (err) throw err;
    console.log("Result: " + result);
  });
});

console.log("without con.connect")
  mysqlcon.query("SELECT * FROM discordstats.guild_204611492010524672;", function (err, result){
    if (err) throw err;
    console.log("Result: " + result);
  });


//Executes when the bot is logged into Discord
client.on('ready', () => {
  console.log('Bot should now be ready');
});

client.on('message', message => {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
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
    numbers[numbers.length] = {srvid: message.guild.id, name: message.guild.name, value: 0, topic: 0, region: message.guild.region}
  }

  if (numbers[srvinarray].region == null){
    numbers[srvinarray].region = message.guild.region
  }

  if (numbers[srvinarray].icon == null){
    //console.log("Added to a value in array")
    numbers[srvinarray].icon = message.guild.iconURL
  }

  //Increases message counter
  if (numbers[srvinarray].value != "undefined"){
    numbers[srvinarray].value = numbers[srvinarray].value + 1
  }
  var numbers2 = numbers.sort(function(a, b){return b.value-a.value})

  console.log("checking if table exists")
  //try{
    mysqlcon.query("CREATE TABLE IF NOT EXISTS guild_" + message.guild.id + "(Date varchar(10), TotalCount int, DailyCount int, Rank int);", function (err, result2) {
    if(err){throw err}
    console.log("inside")
    console.log("Result:");
    console.log(result2)
  });
/*}
catch(err){
  if (err) {
    console.log(err)
    console.log("creating table")
      mysqlcon.query("CREATE TABLE guild_" + message.guild.id + "(Date varchar(10), TotalCount int, DailyCount int, Rank int);"), function (err, result) {
        console.log("Result:");
        console.log(result)
        return false;
  }
}*/

  var d = new Date;

  var dateyear = d.getFullYear()
  var datemonth = d.getMonth() + 1
  var datedate = d.getDate()

  if (datemonth < 10){
    var datemonth = "0" + datemonth
  }

  var updatevalues = function(sqlsrvdailycount){
    var rankcurrently = srvinarray + 1
  mysqlcon.query("UPDATE guild_" + message.guild.id + " SET TotalCount=" + numbers[srvinarray].value + ", DailyCount=" + sqlsrvdailycount + ", Rank=" + rankcurrently + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "' ;", function (err, result) {
    if (err) {
          console.log("Error:");
          console.log(err)
          return false;
    }
    console.log("UPDATE: " + message.guild.id + ";" + numbers[srvinarray].value + ";" + sqlsrvdailycount + ";" + srvinarray)
    console.log("Result:");
    console.log(result)
  });
}


  console.log("second step")
  console.log(dateyear + "-" + datemonth + "-" + datedate)
  mysqlcon.query("SELECT * FROM guild_" + message.guild.id + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "';", function(err, result){

    if(result[0] == null) {
      console.log("Error in select area:")
      console.log(err)
      mysqlcon.query("INSERT INTO `guild_" + message.guild.id + "` (Date, TotalCount, DailyCount, Rank) VALUES ('" + dateyear + "-" + datemonth + "-" + datedate + "', " + numbers[srvinarray].value + ", 0, " + srvinarray + ");", function (err, result, fields) {
        console.log("insert prompt")
        if (err) {
              console.log("Error in insert area:");
              console.log(err)
              return false;
        }
        console.log("Result:");
        console.log(result)
        var sqlsrvdailycount = 0
        updatevalues()
      });
    }
    else{
    console.log("Result:")
    console.log(result)
    var test = 0
    if(result === "[]") {var test = 1}
    console.log(test)
    console.log("result[0].dailycount:")
    console.log(result[0].DailyCount)
    var sqlsrvdailycount = result[0].DailyCount + 1
    updatevalues(sqlsrvdailycount)
  }

  });

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

  if (numbersauth[authorinarray].avatar == null){
    //console.log("Added to a value in array")
    numbersauth[authorinarray].avatar = message.author.avatarURL
    console.log(message.author.avatarURL)
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
