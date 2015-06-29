var express    = require('express'),
  bodyParser   = require('body-parser');
module.exports = function (app) {
  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  //setup to render html files
  //app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'ejs');
  // Setup static public directory
  app.use(express.static(__dirname + '/../public'));
  app.set('views', __dirname + '/../views');
};