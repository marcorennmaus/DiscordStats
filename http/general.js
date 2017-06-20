module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb){
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/plain');
      //var responselist = "Last message took " + timetaken + "ms to process\n\n"
      var responselist = "Pos | Server                           | Category | Messages\n"
      for(i = 0;i < numbers.length;i++){
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

        responselist = responselist + posnumber + " | " + servernames + " | " + categoryname + " | "+ numbers[i].value + "\n"
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
    }
}
