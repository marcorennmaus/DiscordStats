const cmdping = require('./ping.js');
const cmdsrvrank = require('./serverrank.js');
const cmdsrvranklist = require('./srvranklist.js');
const cmdathranklist = require('./athranklist.js');
const cmdauthorsearch = require('./authorsearch.js');

module.exports = {
    react2message: function(message, numbers, numbersauth, categorydb, srvinarray, authorinarray){
      if (message.content === 'hey marco give me a ping' && message.author.username === "marco_rennmaus | Rennmoose") {
          cmdping.main(message)
      }
      if (message.content === "hey marco give me a rank" && message.author.username === "marco_rennmaus | Rennmoose") {
          cmdsrvrank.main(message, numbers, numbersauth, categorydb, srvinarray)
      }
      if (message.content === "hey marco give me the top 5" && message.author.username === "marco_rennmaus | Rennmoose") {
        cmdsrvranklist.main(message, numbers, numbersauth, categorydb, srvinarray)
      }

      if (message.content === "hey marco give me the top 5 without any life" && message.author.username === "marco_rennmaus | Rennmoose") {
        cmdathranklist.main(message, numbers, numbersauth, categorydb, authorinarray)
      }

      if (message.content.startsWith("hey marco give me the rank of someone") && message.author.username === "marco_rennmaus | Rennmoose"){
        cmdauthorsearch.main(message, numbers, numbersauth, categorydb)
      }
}
}
