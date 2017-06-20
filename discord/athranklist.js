module.exports = {
    main: function(message, numbers, numbersauth, categorydb, authorinarray){
      var responselist = "Pos | Author                           | Messages\n"
      for(i = 0;i < 5;i++){
        var ranking = authorinarray + 1
        //Filling up variables with some spaces
        var posnumber = i + 1
        var posnumber = posnumber + "   "
        var authornames = numbersauth[i].name + "                                " + "."
        //Cutting variables to fit nicely into that table
        var authornames = authornames.substr(0, 32)
        var posnumber = posnumber.substr(0, 3)

        responselist = responselist + posnumber + " | " + authornames + " | " + numbersauth[i].value + "\n"
      }

      if(authorinarray >= 5){
        var authornames = message.author.name + "                                "
        var authornames = authornames.substr(0, 32)
        var ranking = ranking + "   "
        var ranking = ranking.substr(0, 3)
        responselist = responselist + ranking + " | " + authornames + " | " + numbersauth[authorinarray].value + "\n"
      }
      message.channel.send("```" + responselist + "```")
}
}
