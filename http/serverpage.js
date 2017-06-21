module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var serverid = urlargs[2]
      var pagetempfile = "./http/templates/serversite.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")

      for (i = 0;i < numbers.length;i++){
        console.log(numbers[i].srvid + " vs. " + serverid)
        if(numbers[i].srvid === serverid){
          var responsebff = numbers[i].name + "\n\n"
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
        //as long as it works
        var pagetemplate = pagetemplate.replace(/var_srvname/gi, function srvnamereplace(x){return numbers[i].name;});
        var pagetemplate = pagetemplate.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbers[i].value;});
        var pagetemplate = pagetemplate.replace(/var_catname/gi, function catnamereplace(x){return categorydb[catid].name;});
        var pagetemplate = pagetemplate.replace(/var_catid/gi, function catnamereplace(x){return categorydb[catid].id;});
        var pagetemplate = pagetemplate.replace(/var_catrank/gi, function catrankreplace(x){return rankincat;});
        var pagetemplate = pagetemplate.replace(/var_regname/gi, function regnamereplace(x){return numbers[i].region;});
        var pagetemplate = pagetemplate.replace(/var_regrank/gi, function regrankreplace(x){return rankinreg;});
        i++
        var pagetemplate = pagetemplate.replace(/var_totalrank/gi, function totalrankreplace(x){return i;})
        response.end(pagetemplate)
        return false;
        }
      }
      response.end("Server not found");
      return false;
    }
}
