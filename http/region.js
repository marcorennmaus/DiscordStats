module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var regionname = urlargs[3]
      var responselist = "Pos | Server                           | Category | Messages\n"
      var catposnumber = 0
      for (i = 0;i < numbers.length;i++){
        if(numbers[i].region === regionname){
          var catid = numbers[i].topic
          var categoryname = categorydb[catid].name
          var categoryname = categoryname + "        "
          var categoryname = categoryname.substr(0, 8)
          catposnumber = catposnumber + 1
          var servernames = numbers[i].name + "                                "
          var servernames = servernames.substr(0, 32)
          var catposnumdis = catposnumber + "   "
          var catposnumdis = catposnumdis.substr(0, 3)
          responselist = responselist + catposnumdis + " | " + servernames + " | " + categoryname + " | "+ numbers[i].value + "\n"
        }
      }
      response.end(responselist + 'END\n');
      return false;
    }
}
