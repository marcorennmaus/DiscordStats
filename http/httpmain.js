const httpcategory = require('./category.js');
const httpversion = require("./version.js");
const httpgeneral = require("./general.js")
const httpregion = require("./region.js")
const httpserverpage = require("./serverpage.js")
const httpusersite = require("./userpage.js")
const httpsearch = require("./search.js")

module.exports = {
    react2response: function(request, response, vnum, numbers, numbersauth, categorydb, fs, chartjs, mysql, mysqlcon, timetakenavgarray, timetakentimerarray, messagesduringperiodarray, timetakenmysqlavgarray){
      try{
        console.log(request.url)
        if(request.url.startsWith("/guilds/category/")){
          httpcategory.main(request, response, numbers, numbersauth, categorydb)
          return false;
        }

        if(request.url.startsWith("/files/Chart.js")){
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/plain');
          response.end(chartjs)
          return false;
        }

        if(request.url.startsWith("/leagues")){
          var leaguefile = "./http/templates/championship.html"
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html');
          var leaderboardleagues = fs.readFileSync(leaguefile, "utf8")
          response.end(leaderboardleagues)
          return false;
        }

        if(request.url.startsWith("/search")){
          httpsearch.main(request, response, numbers, numbersauth, categorydb, fs)
          return false;
        }

        if(request.url.startsWith("/status")){
          httpversion.main(request, response, vnum, timetakenavgarray, timetakentimerarray, fs, messagesduringperiodarray, timetakenmysqlavgarray)
          return false;
        }

        if(request.url.startsWith("/guilds/")){
          if(request.url.startsWith("/guilds/region/")){
            httpregion.main(request, response, numbers, numbersauth, categorydb)
            return false;
          }
          httpserverpage.main(request, response, numbers, numbersauth, categorydb, fs, mysql, mysqlcon)
          return false;
        }

        if(request.url.startsWith("/users/")){
          httpusersite.main(request, response, numbers, numbersauth, categorydb, fs, mysql, mysqlcon)
          return false;
        }

        httpgeneral.main(request, response, numbers, numbersauth, categorydb, fs)
        return false;
    }
    catch(err){
      response.statusCode = 500;
      var responsebff = "Something failed during the process: " + err + "\n\n"
      /*if (categoryid > 5 && request.url.startsWith("/guilds/category/")){
        responsebff = responsebff + "Did you try entering a not existing category? Only categories 0 to 5 exist currently."
      }*/
      response.end(responsebff)
    }
}
}
