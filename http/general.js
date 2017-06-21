module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb, fs){
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      var pagetempfile = "./http/templates/general.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")
      var tabletempfile = "./http/templates/generaltablerow.html"
      var srvlistcontinued = ""
      var athlistcontinued = ""
      var tablerow = fs.readFileSync(tabletempfile, "utf8")
      var responselist = "Pos | Server                           | Category | Messages\n"
      for(i = 0;i < numbers.length;i++){
        var tablerow2 = tablerow
        //Filling up variables with some spaces
        var posnumber = i + 1
        var posnumber = posnumber + "   "
        var servernames = numbers[i].name + "                                " + "."
        //Cutting variables to fit nicely into that table
        var servernames = servernames.substr(0, 32)
        var posnumber = posnumber.substr(0, 3)
        var categoryid = numbers[i].topic
        //console.log("Categoryid: " + categoryid)
        var categoryname = categorydb[categoryid].name
        var categoryname = categoryname + "        "
        var categoryname = categoryname.substr(0, 8)

        var tablerow2 = tablerow2.replace(/var_thingrank/gi, function thingrankreplace(x){return posnumber;});
        var tablerow2 = tablerow2.replace(/var_thingid/gi, function thingidreplace(x){return numbers[i].srvid;});
        var tablerow2 = tablerow2.replace(/var_thingname/gi, function thingrankreplace(x){return numbers[i].name;});
        var tablerow2 = tablerow2.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbers[i].value;});
        var tablerow2 = tablerow2.replace(/var_thingtype/gi, function thingtypereplace(x){return "guilds";});
        var srvlistcontinued = srvlistcontinued + tablerow2
      }

      for(i = 0;i < numbersauth.length;i++){
        var tablerow2 = tablerow
        //Filling up variables with some spaces
        var posnumber = i + 1
        var posnumber = posnumber + "   "
        var authornames = numbersauth[i].name + "                                " + "."
        //Cutting variables to fit nicely into that table
        var authornames = authornames.substr(0, 32)
        var posnumber = posnumber.substr(0, 3)

        var tablerow2 = tablerow2.replace(/var_thingrank/gi, function thingrankreplace(x){return posnumber;});
        var tablerow2 = tablerow2.replace(/var_thingid/gi, function thingidreplace(x){return numbersauth[i].usrid;});
        var tablerow2 = tablerow2.replace(/var_thingname/gi, function thingrankreplace(x){return numbersauth[i].name;});
        var tablerow2 = tablerow2.replace(/var_msgtotal/gi, function msgtotalreplace(x){return numbersauth[i].value;});
        var tablerow2 = tablerow2.replace(/var_thingtype/gi, function thingtypereplace(x){return "users";});
        var athlistcontinued = athlistcontinued + tablerow2
      }
      //ending response
      var pagetemplate = pagetemplate.replace(/var_tablesrvcontinue/gi, function srvtablereplace(x){return srvlistcontinued;});
      var pagetemplate = pagetemplate.replace(/var_tableathcontinue/gi, function athtablereplace(x){return athlistcontinued;});
      response.end(pagetemplate);
    }
}
