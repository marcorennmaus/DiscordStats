module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs, mysql, mysqlcon){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var userid = urlargs[2]
      var pagetempfile = "./http/templates/usersite.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")


      for (i = 0;i < numbersauth.length;i++){
        if(numbersauth[i].usrid === userid){
          var authorinarray = i
          if (numbersauth[authorinarray].avatar == null){
            var discordavatar = ""
          }
          if (numbersauth[authorinarray].avatar != null){
            var discordavatar = numbersauth[authorinarray].avatar
          }
          var responsebff = numbersauth[authorinarray].name + "\n\n"

          var legacyfallback = function(pagetemplate){
            var legacyusername = numbersauth[authorinarray].name + " [LEGACY USER]"
            var pagetemplate = pagetemplate.replace(/var_usrname/gi, function usrnamereplace(x){return legacyusername;});
            var pagetemplate = pagetemplate.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbersauth[authorinarray].value;});
            var pagetemplate = pagetemplate.replace(/var_avatarurl/gi, function totalrankreplace(x){return discordavatar;})
            i++
            var pagetemplate = pagetemplate.replace(/var_totalrank/gi, function totalrankreplace(x){return i;})
            response.end(pagetemplate)
          }

          mysqlcon.query("SELECT date FROM author_" + userid + ";", function (err, result) {
            if (err) {
                  console.log("Error:");
                  console.log(err)
                  legacyfallback(pagetemplate)
                  return false;
            }
            console.log("Result: HTTP1");
            console.log(result)
            mysqlcon.query("SELECT totalcount FROM author_" + userid + ";", function (err, result2) {
              if (err) {
                    console.log("Error:");
                    console.log(err)
                    legacyfallback(pagetemplate)
                    return false;
              }
              console.log("Result: HTTP2");
              console.log(result2)
              mysqlcon.query("SELECT dailycount FROM author_" + userid + ";", function (err, result3) {
                if (err) {
                      console.log("Error:");
                      console.log(err)
                      legacyfallback(pagetemplate)
                      return false;
                }
                mysqlcon.query("SELECT rank FROM author_" + userid + ";", function (err, result4) {
                  if (err) {
                        console.log("Error:");
                        console.log(err)
                        legacyfallback(pagetemplate)
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
        console.log(authorinarray + "i<---")
        console.log("It's just before" + numbersauth[authorinarray].name)
        var pagetemplate = fs.readFileSync(pagetempfile, "utf8")
        console.log("0")
        var pagetemplate = pagetemplate.replace(/var_usrname/gi, function srvnamereplace(x){return numbersauth[authorinarray].name;});
        console.log("1")
        var pagetemplate = pagetemplate.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbersauth[authorinarray].value;});
          console.log("7")
        var pagetemplate = pagetemplate.replace(/var_avatarurl/gi, function servericonreplace(x){return discordavatar;})
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
          res2[a] = result2[a].totalcount
        }
        for(b = 0;b < result.length;b++){
          res1[b] = "'" + result[b].date + "'"
        }
        for(c = 0;c < result3.length;c++){
          res3[c] = "'" + result3[c].dailycount + "'"
        }
        for(d = 0;d < result4.length;d++){
          res4[d] = "'" + result4[d].rank + "'"
        }
        console.log("Result2: " + result2[0])
        console.log("Result: " + result[0])
        var pagetemplate = pagetemplate.replace(/var_datavalues/gi, function servericonreplace(x){return res2;})
        var pagetemplate = pagetemplate.replace(/var_labelnames/gi, function servericonreplace(x){return res1;})
        var pagetemplate = pagetemplate.replace(/var_datavalue2/gi, function servericonreplace(x){return res3;})
        var pagetemplate = pagetemplate.replace(/var_datavalue3/gi, function servericonreplace(x){return res4;})
        i++
        var pagetemplate = pagetemplate.replace(/var_totalrank/gi, function totalrankreplace(x){return authorinarray;})
        response.end(pagetemplate)
        return false;
      }
    }
}
      //response.end("User not found");
      //return false;
}
}
