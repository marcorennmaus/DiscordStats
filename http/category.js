module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var categoryid = urlargs[3]
      var categoryid = parseInt(categoryid)
      var categoryname = categorydb[categoryid].name
      var categoryname = categoryname + "        "
      var categoryname = categoryname.substr(0, 8)
      var responselist = "Pos | Server                           | Category | Messages\n"
      var catposnumber = 0
      for (i = 0;i < numbers.length;i++){
        if(numbers[i].topic === categoryid){
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
