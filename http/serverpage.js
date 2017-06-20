module.exports = {
    main: function(request, response, numbers, numbersauth, categorydb){
      response.statusCode = 200;
      var urlargs = request.url.split("/")
      var serverid = urlargs[2]

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
        i++
        responsebff = responsebff + "Rank total: " + i + "\nRank in Category " + categorydb[catid].name + ": " + rankincat + "\nRank in Region " + regname + ": " + rankinreg + "\n"
        response.end(responsebff)
        return false;
        }
      }
      response.end("Server not found");
      return false;
    }
}
