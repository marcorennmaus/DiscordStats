module.exports = {
    main: function(message, numbers, numbersauth, categorydb){
      var msgargs = message.content.split(" ")
      var searchauthor = msgargs[8]
      var schAuthorHasBeenFound = false;


      for(i = 0;i < numbersauth.length;i++){
        if(searchauthor === numbersauth[i].usrid){
          var schAuthorHasBeenFound = true;
          var authorinarray = i;
          //console.log("author has been found")
        }
      }

      if(schAuthorHasBeenFound){
        var rankauth = authorinarray + 1
        message.channel.send("**" + numbersauth[authorinarray].name + "** is currently on Place " + rankauth + " with a total of " + numbersauth[authorinarray].value + " messages")
      }

      if(schAuthorHasBeenFound != true){
        message.channel.send("User was not found")
      }
}
}
