module.exports = {
    main: function(request, response, vnum, timetakenavgarray, timetakentimerarray, fs, messagesduringperiodarray, timetakenmysqlavgarray){
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html');
      var pagetempfile = "./http/templates/status.html"
      var pagetemplate = fs.readFileSync(pagetempfile, "utf8")

      var pagetemplate = pagetemplate.replace(/var_timerlabels/gi, function regrankreplace(x){return timetakentimerarray;});
      var pagetemplate = pagetemplate.replace(/var_timevalues/gi, function servericonreplace(x){return timetakenavgarray;})
      var pagetemplate = pagetemplate.replace(/var_messagevalues/gi, function servericonreplace(x){return messagesduringperiodarray;})
      var pagetemplate = pagetemplate.replace(/var_mysqltimervalues/gi, function servericonreplace(x){return timetakenmysqlavgarray;})
      response.end(pagetemplate)
      return false;
    }
}
