module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var userid = urlargs[2]
      var pagetempfile = "./http/templates/usersite.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")


      for (i = 0;i < numbersauth.length;i++){
        if(numbersauth[i].usrid === userid){
          if (numbersauth[i].avatar == null){
            var discordavatar = ""
          }
          if (numbersauth[i].avatar != null){
            var discordavatar = numbersauth[i].avatar
          }
          var responsebff = numbersauth[i].name + "\n\n"
        //as long as it works
        var pagetemplate = pagetemplate.replace(/var_usrname/gi, function usrnamereplace(x){return numbersauth[i].name;});
        var pagetemplate = pagetemplate.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbersauth[i].value;});
        var pagetemplate = pagetemplate.replace(/var_avatarurl/gi, function totalrankreplace(x){return discordavatar;})
        i++
        var pagetemplate = pagetemplate.replace(/var_totalrank/gi, function totalrankreplace(x){return i;})
        response.end(pagetemplate)
        return false;
        }
      }
      response.end("User not found");
      return false;
    }
}
