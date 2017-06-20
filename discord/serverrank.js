module.exports = {
    main: function(message, numbers, numbersauth, categorydb, srvinarray){
      var ranking = srvinarray + 1
      var total = numbers.length + 1
      console.log("giving rank")
      message.channel.send(["**" + message.guild.name + "** is currently ranked on Place **" + ranking + "** of " + total])
      }
}
