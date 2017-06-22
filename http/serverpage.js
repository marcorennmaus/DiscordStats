module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs, mysql, mysqlcon){
      response.statusCode = 200;


      var urlargs = request.url.split("/")
      var serverid = urlargs[2]
      var pagetempfile = "./http/templates/serversite.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")
      console.log("numbers.length = " + numbers.length)
      for (i = 0;i < numbers.length;i++){
        console.log(i)
        console.log(numbers[i].srvid + " vs. " + serverid)
        if(numbers[i].srvid === serverid){
          var srvinarray = i
          if (numbers[i].icon == null){
            var discordavatar = ""
          }
          if (numbers[i].icon != null){
            var discordavatar = numbers[i].icon
          }
          var pagetemplate = pagetemplate.replace(/var_avatarurl/gi, function totalrankreplace(x){return discordavatar;})
          var responsebff = numbers[i].name + "\n\n"
          console.log(numbers[i].name)
          var rankincat = 1
          var rankinreg = 1
          var catid = numbers[i].topic
          var regname = numbers[i].region
          for (l = 0;l < i; l++){
            if(numbers[l].topic === numbers[i].topic){
              rankincat++
            }
          }
          for (l = 0;l < i; l++){
            if(numbers[l].region === numbers[i].region){
              rankinreg++
            }
          }

          mysqlcon.query("SELECT date FROM guild_" + serverid + ";", function (err, result) {
            if (err) {
                  console.log("Error:");
                  console.log(err)
                  return false;
            }
            console.log("Result: HTTP1");
            console.log(result)
            mysqlcon.query("SELECT totalcount FROM guild_" + serverid + ";", function (err, result2) {
              if (err) {
                    console.log("Error:");
                    console.log(err)
                    return false;
              }
              console.log("Result: HTTP2");
              console.log(result2)
              mysqlcon.query("SELECT dailycount FROM guild_" + serverid + ";", function (err, result3) {
                if (err) {
                      console.log("Error:");
                      console.log(err)
                      return false;
                }
                mysqlcon.query("SELECT rank FROM guild_" + serverid + ";", function (err, result4) {
                  if (err) {
                        console.log("Error:");
                        console.log(err)
                        return false;
                  }
              console.log("about to launch buildpage")
              buildpage(result, result2, result3, result4)
            });
          });
        });
});
        //as long as it works
        var buildpage = function(result, result2, result3, result4){
        console.log(i + "i<---")
        console.log("It's just before" + numbers[srvinarray].name)
        var pagetemplate = fs.readFileSync(pagetempfile, "utf8")
        console.log("0")
        var pagetemplate = pagetemplate.replace(/var_srvname/gi, function srvnamereplace(x){return numbers[srvinarray].name;});
        console.log("1")
        var pagetemplate = pagetemplate.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbers[srvinarray].value;});
        console.log("2")
        var pagetemplate = pagetemplate.replace(/var_catname/gi, function catnamereplace(x){return categorydb[catid].name;});
          console.log("3")
        var pagetemplate = pagetemplate.replace(/var_catid/gi, function catnamereplace(x){return categorydb[catid].id;});
          console.log("4")
        var pagetemplate = pagetemplate.replace(/var_catrank/gi, function catrankreplace(x){return rankincat;});
          console.log("5")
        var pagetemplate = pagetemplate.replace(/var_regname/gi, function regnamereplace(x){return numbers[srvinarray].region;});
          console.log("6")
        var pagetemplate = pagetemplate.replace(/var_regrank/gi, function regrankreplace(x){return rankinreg;});
          console.log("7")
        var pagetemplate = pagetemplate.replace(/var_servericon/gi, function servericonreplace(x){return discordavatar;})
        console.log("8")
        console.log("testtsfsdsaf")
        console.log("Result2: " + result2)
        console.log("Result: " + result)
        //var result2 = JSON.stringify(result2[0])
        //var result = JSON.stringify(result[0])
        var res1 = []
        var res2 = []
        var res3 = []
        var res4 = []
        console.log("abouttoconvertmaybehahaha")
        console.log()
        for(a = 0;a < result2.length;a++){
          console.log("ResultA")
          console.log(result2)
          console.log(result2[a])
          console.log(result2[a].totalcount)
          res2[a] = result2[a].totalcount
        }
        for(b = 0;b < result.length;b++){
          console.log("ResultB")
          console.log(result[b])
          console.log(result[b].date)
          res1[b] = "'" + result[b].date + "'"
        }
        for(c = 0;c < result3.length;c++){
          console.log("ResultC")
          console.log(result3[c])
          console.log(result3[c].dailycount)
          res3[c] = "'" + result3[c].dailycount + "'"
        }
        for(d = 0;d < result4.length;d++){
          console.log("ResultD")
          console.log(result4[d])
          console.log(result4[d].rank)
          res4[d] = "'" + result4[d].rank + "'"
        }
        console.log("Result2: " + result2[0])
        console.log("Result: " + result[0])
        var pagetemplate = pagetemplate.replace(/var_datavalues/gi, function servericonreplace(x){return res2;})
        var pagetemplate = pagetemplate.replace(/var_labelnames/gi, function servericonreplace(x){return res1;})
        var pagetemplate = pagetemplate.replace(/var_datavalue2/gi, function servericonreplace(x){return res3;})
        var pagetemplate = pagetemplate.replace(/var_datavalue3/gi, function servericonreplace(x){return res4;})
        srvinarray++
        var pagetemplate = pagetemplate.replace(/var_totalrank/gi, function totalrankreplace(x){return srvinarray;})
        response.end(pagetemplate)
        return false;
      }
      }
      else{
      //response.end("Server not found");
      //return false;
    }
    }
}}
