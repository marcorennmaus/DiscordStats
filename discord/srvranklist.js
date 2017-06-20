module.exports = {
    main: function(message, numbers, numbersauth, categorydb, srvinarray){
        var responselist = "Pos | Server                           | Messages\n"
        for(i = 0;i < 5;i++){
          var ranking = srvinarray + 1
          //Filling up variables with some spaces
          var posnumber = i + 1
          var posnumber = posnumber + "   "
          var servernames = numbers[i].name + "                                " + "."
          //Cutting variables to fit nicely into that table
          var servernames = servernames.substr(0, 32)
          var posnumber = posnumber.substr(0, 3)

          responselist = responselist + posnumber + " | " + servernames + " | " + numbers[i].value + "\n"
        }

        if(srvinarray >= 4){
          var servernames = message.guild.name + "                                "
          var servernames = servernames.substr(0, 32)
          var ranking = ranking + "   "
          var ranking = ranking.substr(0, 3)
          responselist = responselist + ranking + " | " + servernames + " | " + numbers[srvinarray].value + "\n"
        }
        message.channel.send("```" + responselist + "```")
}
}
