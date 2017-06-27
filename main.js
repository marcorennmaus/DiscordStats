//adding librarys, doing some setup stuff
//TODO: Split everything up in multiple files

var d = new Date();
var vnum = "0.6-beta"
var builddate = "26-06-2017"

console.log("Starting up DiscordStats, Version: " + vnum + " (" + builddate + ")")
const Discord = require('discord.js');
const fs = require("fs");
const http = require('http');
const client = new Discord.Client();
const httpmain = require("./http/httpmain.js")
const util = require('util');
const mysql = require("mysql");

var numbersauth = [];
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
var timetakenarray = []
var timetakenavgarray = []
var timetakenmysqlavgarray = []
var timetakenmysqlarray = []
var timetakentimerarray = []
var messagesduringperiod = 0
var messagesduringperiodarray = []

var mysqlcon = mysql.createConnection({
  host: mysqlhost,
  user: mysqluser,
  password: mysqlpass,
  database: "discordstats"
});

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
    httpmain.react2response(request, response, vnum, numbers, numbersauth, categorydb, fs, chartjs, mysql, mysqlcon, timetakenavgarray, timetakentimerarray, messagesduringperiodarray, timetakenmysqlavgarray)
  //Some logging stuff of the requests, can be used for debug
	console.log("Headers: " + headers)
	console.log("Method: " + method)
	console.log("URL: " + url)
	console.log("Body: " + body)

  });
}).listen(80);

//DISCORD PART

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
  if (message.guild.id == "327962579815366676"){
    //Deactivates responding and counting somewhere | DO NOT DELETE
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

  if (numbers[srvinarray].ownerid == null){
    numbers[srvinarray].ownerid = message.guild.ownerid
  }

  //Increases message counter
  if (numbers[srvinarray].value != "undefined"){
    numbers[srvinarray].value = numbers[srvinarray].value + 1
  }

  if(numbers[srvinarray].name != message.guild.name){
    numbers[srvinarray].name = message.guild.name
  }
  if(numbers[srvinarray].region != message.guild.region){
    numbers[srvinarray].region = message.guild.region
  }
  if(numbers[srvinarray].name != message.guild.name){
    numbers[srvinarray].name = message.guild.name
  }

  var numbers2 = numbers.sort(function(a, b){return b.value-a.value})

  console.log("checking if table exists")
  //try{
    mysqlcon.query("CREATE TABLE IF NOT EXISTS guild_" + message.guild.id + "(Date varchar(10), TotalCount int, DailyCount int, Rank int);", function (err, result2) {
    if(err){throw err}
  });

  var d = new Date;

  var dateyear = d.getFullYear()
  var datemonth = d.getMonth() + 1
  var datedate = d.getDate()

  if (datemonth < 10){
    var datemonth = "0" + datemonth
  }

  var updatevalues = function(sqlsrvdailycount){
    var rankcurrently = srvinarray + 1
    console.log("UPDATE guild_" + message.guild.id + " SET TotalCount=" + numbers[srvinarray].value + ", DailyCount=" + sqlsrvdailycount + ", Rank=" + rankcurrently + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "' ;")
    mysqlcon.query("UPDATE guild_" + message.guild.id + " SET TotalCount=" + numbers[srvinarray].value + ", DailyCount=" + sqlsrvdailycount + ", Rank=" + rankcurrently + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "' ;", function (err, result) {
    if (err) {
          console.log("Error in update:");
          console.log(err)
          return false;
    }
  });
}

  console.log("SELECT * FROM guild_" + message.guild.id + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "';")
  mysqlcon.query("SELECT * FROM guild_" + message.guild.id + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "';", function(err, result){

    if(result[0] == null) {
      console.log("INSERT INTO `guild_" + message.guild.id + "` (Date, TotalCount, DailyCount, Rank) VALUES ('" + dateyear + "-" + datemonth + "-" + datedate + "', " + numbers[srvinarray].value + ", 0, " + srvinarray + ");")
      mysqlcon.query("INSERT INTO `guild_" + message.guild.id + "` (Date, TotalCount, DailyCount, Rank) VALUES ('" + dateyear + "-" + datemonth + "-" + datedate + "', " + numbers[srvinarray].value + ", 0, " + srvinarray + ");", function (err, result, fields) {
        console.log("insert prompt")
        if (err) {
              console.log("Error in insert area:");
              console.log(err)
              return false;
        }
        var sqlsrvdailycount = 0
        updatevalues(sqlsrvdailycount)
      });
    }
    else{
    var sqlsrvdailycount = result[0].DailyCount + 1
    updatevalues(sqlsrvdailycount)
  }
  });

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

  if (numbersauth[authorinarray].avatar == null){
    //console.log("Added to a value in array")
    numbersauth[authorinarray].avatar = message.author.avatarURL
    console.log(message.author.avatarURL)
  }


  console.log("checking if table exists")
  //try{
    console.log("CREATE TABLE IF NOT EXISTS author_" + message.author.id + "(Date varchar(10), TotalCount int, DailyCount int, Rank int);")
    mysqlcon.query("CREATE TABLE IF NOT EXISTS author_" + message.author.id + "(Date varchar(10), TotalCount int, DailyCount int, Rank int);", function (err, result2) {
    if(err){throw err}
  });

  var d = new Date;

  var dateyear = d.getFullYear()
  var datemonth = d.getMonth() + 1
  var datedate = d.getDate()

  if (datemonth < 10){
    var datemonth = "0" + datemonth
  }


    var updatevalues2 = function(sqlathdailycount){
      var rankcurrently = authorinarray + 1
      console.log("UPDATE author_" + message.author.id + " SET TotalCount=" + numbersauth[authorinarray].value + ", DailyCount=" + sqlathdailycount + ", Rank=" + rankcurrently + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "' ;")
    mysqlcon.query("UPDATE author_" + message.author.id + " SET TotalCount=" + numbersauth[authorinarray].value + ", DailyCount=" + sqlathdailycount + ", Rank=" + rankcurrently + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "' ;", function (err, result) {
      if (err) {
            console.log("Error:");
            console.log(err)
            return false;
      }
    });
    var d = new Date();
    var endate2 = d.getTime();
    //console.log(endate + ":" + stdate)
    var timetakenms = endate2 - stdate
    timetakenmysqlarray[timetakenmysqlarray.length] = timetakenms
    console.log(timetakenmysqlarray)
  }

  console.log("SELECT * FROM author_" + message.author.id + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "';")
  mysqlcon.query("SELECT * FROM author_" + message.author.id + " WHERE Date = '" + dateyear + "-" + datemonth + "-" + datedate + "';", function(err, result){

    if(result[0] == null) {
      console.log("INSERT INTO `author_" + message.author.id + "` (Date, TotalCount, DailyCount, Rank) VALUES ('" + dateyear + "-" + datemonth + "-" + datedate + "', " + numbersauth[authorinarray].value + ", 0, " + authorinarray + ");")
      mysqlcon.query("INSERT INTO `author_" + message.author.id + "` (Date, TotalCount, DailyCount, Rank) VALUES ('" + dateyear + "-" + datemonth + "-" + datedate + "', " + numbersauth[authorinarray].value + ", 0, " + authorinarray + ");", function (err, result, fields) {
        console.log("insert prompt")
        if (err) {
              console.log("Error in insert area:");
              console.log(err)
              return false;
        }
        var sqlathdailycount = 0
        updatevalues2(sqlathdailycount)
      });
    }
    else{
    var sqlathdailycount = result[0].DailyCount + 1
    updatevalues2(sqlathdailycount)
  }

  });

//Updates outdated values

  if(numbersauth[authorinarray].avatar != message.author.avatarURL){
    numbersauth[authorinarray].avatar = message.author.avatarURL
  }
  if(numbersauth[authorinarray].name != message.author.username){
    numbersauth[authorinarray].name = message.author.username
  }


  var numbersauth2 = numbersauth.sort(function(a, b){return b.value-a.value})

  var d = new Date();
  var endate = d.getTime();
  //console.log(endate + ":" + stdate)
  var timetaken = endate - stdate
  console.log("[" + timetaken + "ms][]" + srvinarray + "@" + authorinarray + "][" + message.author.username + "@" + message.guild.name + "] " + message.content)

  discordcmds.react2message(message, numbers, numbersauth, categorydb, srvinarray, authorinarray)
  timetakenarray[timetakenarray.length] = timetaken
  console.log(timetakenarray)
  messagesduringperiod++
});


//Selfbot Token
var token = tokenfile.gettoken()
console.log(token)
client.login(token);

setInterval(function(){
  var d = new Date();
  var hour = d.getHours()
  var minutes = d.getMinutes()
  var seconds = d.getSeconds()

  var total = 0;
  var total2 = 0;
  for(var i = 0; i < timetakenarray.length; i++) {
      total += timetakenarray[i];
  }
  var average = total / timetakenarray.length;
  var average = Math.round(average);

  for(var i = 0; i < timetakenmysqlarray.length; i++) {
      total2 += timetakenmysqlarray[i];
  }
  var average2 = total2 / timetakenmysqlarray.length;
  var average2 = Math.round(average2);

  if(timetakenavgarray.length >= 180){
    timetakenavgarray.shift()
    timetakentimerarray.shift()
    messagesduringperiodarray.shift()
    timetakenmysqlavgarray.shift()
  }
  timetakenavgarray[timetakenavgarray.length] = average
  timetakenmysqlavgarray[timetakenmysqlavgarray.length] = average2
  var datestring = '"' + hour + ":" + minutes + ':' + seconds + '"'
  timetakentimerarray[timetakentimerarray.length] = datestring
  messagesduringperiodarray[messagesduringperiodarray.length] = messagesduringperiod
  timetakenarray = []
  timetakenmysqlarray = []
  messagesduringperiod = 0

  console.log(timetakenavgarray)
  console.log(timetakenmysqlavgarray)
}, 10000);

setInterval(function(){
  var tobesaved = JSON.stringify(numbers, 0, 1)
fs.writeFile(srvdb, tobesaved);
}, 30000);

setInterval(function(){
  var tobesaved2 = JSON.stringify(numbersauth, 0, 1)
fs.writeFile(authdb, tobesaved2);
}, 30000);
