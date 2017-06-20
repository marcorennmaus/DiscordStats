const httpcategory = require('./category.js');
const httpversion = require("./version.js");
const httpgeneral = require("./general.js")

module.exports = {
    react2response: function(request, response, vnum, numbers, numbersauth, categorydb){
      try{

        if(request.url.startsWith("/guilds/category/")){
          httpcategory.main(request, response, numbers, numbersauth, categorydb)
          return false;
        }

        if(request.url.startsWith("/version")){
          httpversion.main(request, response, vnum)
          return false;
        }

        httpgeneral.main(request, response, numbers, numbersauth, categorydb)
        return false;
      //Some logging stuff of the requests, can be used for debug
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
