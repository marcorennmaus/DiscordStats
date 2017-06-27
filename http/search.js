module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs){
      response.statusCode = 200;
      var pagetempfile = "./http/templates/search.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")
      var tablecontinuetemplate = "./http/templates/searchtablerow.html"
      var results = []
      var resultsauth = []
      var tablesrv = ""
      var tableath = ""
      var athlist = ""
      var srvlistcontinued = ""
      var tablerow = fs.readFileSync(tablecontinuetemplate, "utf8")
      var urlargs = request.url.split("/")
      var searchstring = urlargs[2]
      var searchstring = searchstring.toLowerCase();
      for(i = 0;i < numbers.length;i++){
        var fullstring = numbers[i].name
        var fullstring = fullstring.toLowerCase();
        if(fullstring.indexOf(searchstring) !== -1){
          results[results.length] = i
        }
      }
      if(results.length > 0){
        for(l = 0;l < results.length;l++){
            var tablerow2 = tablerow
            var search = results[l]
            var tablerow2 = tablerow2.replace(/var_usericon/gi, function thingrankreplace(x){return numbers[search].icon;});
            var tablerow2 = tablerow2.replace(/var_name/gi, function thingidreplace(x){return numbers[search].name;});
            var tablerow2 = tablerow2.replace(/var_id/gi, function thingidreplace(x){return numbers[search].id;});
            var tablerow2 = tablerow2.replace(/var_thingtype/gi, function thingidreplace(x){return "guilds";});
            var tablerow2 = tablerow2.replace(/var_thingid/gi, function thingidreplace(x){return numbers[search].srvid;});
            var srvlistcontinued = srvlistcontinued + tablerow2
          }
        }

        for(i = 0;i < numbersauth.length;i++){
          var fullstring = numbersauth[i].name
          var fullstring = fullstring.toLowerCase();
          if(fullstring.indexOf(searchstring) !== -1){
            resultsauth[resultsauth.length] = i
          }
        }
        for(l = 0;l < resultsauth.length;l++){
            var tablerow2 = tablerow
            var search = resultsauth[l]
            console.log("SearchID: " + resultsauth[l])
            var tablerow2 = tablerow2.replace(/var_usericon/gi, function thingrankreplace(x){return numbersauth[search].avatar;});
            var tablerow2 = tablerow2.replace(/var_name/gi, function thingidreplace(x){return numbersauth[search].name;});
            var tablerow2 = tablerow2.replace(/var_id/gi, function thingidreplace(x){return numbersauth[search].id;});
            var tablerow2 = tablerow2.replace(/var_thingtype/gi, function thingidreplace(x){return "users";});
            var tablerow2 = tablerow2.replace(/var_thingid/gi, function thingidreplace(x){return numbersauth[search].usrid;});
            var athlistcontinued = athlistcontinued + tablerow2
          }
        if(results.length > 0){
          var srvlist = '<table class="tg">' + srvlistcontinued + '</table>'
        }
        else{
          var srvlist = "<p>No results were found.</p>"
        }

        if(resultsauth.length > 0){
          var athlist = '<table class="tg">' + athlistcontinued + '</table>'
        }
        else{
          var athlist = "<p>No results were found.</p>"
        }

        var pagetemplate = pagetemplate.replace(/var_searchprompt/gi, function thingrankreplace(x){return searchstring;});
        var pagetemplate = pagetemplate.replace(/var_srvlist/gi, function thingreplace(x){return srvlist;});
        var pagetemplate = pagetemplate.replace(/var_athlist/gi, function thingreplace(x){return athlist;});

      response.end(pagetemplate);
      return false;
    }
}
