module.exports = {
    main: function(request, response, vnum){
      response.statusCode = 200;
      response.end("You're using DiscordStats, Version: " + vnum)
      return false;
    }
}
