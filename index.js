const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 5000;
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);
const path = require("path");
const router = express.Router();
const nyt = require('nyt');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');


var keys = {
  'article-search':'gp7dECfa3KusVfxleYgBPO7GAVwgPxmE',
  'best-sellers':'sample-key',
  'campaign-finance':'sample-key',
  'community':'sample-key',
  'congress':'sample-key',
  'districts':'sample-key',
  'event-listings':'sample-key',
  'geo':'sample-key',
  'most-popular':'sample-key',
  'movie-reviews':'sample-key',
  'newswire':'sample-key',
  'real-estate':'sample-key',
  'semantic':'gp7dECfa3KusVfxleYgBPO7GAVwgPxmE',
  'timestags':'sample-key',
  }

var nyt_obj = new nyt(keys);

// --------------------------------------------------------
// tell our app where to listen for connections
server.listen(PORT, () => {
  console.log('Listening on PORT ' + PORT);
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/views"));

router.get("/", (req, res) => {
  nyt_obj.article.search({'query':'linguistics'}, set_article_search_response);
  // nyt_obj.semantic.search({'query':'bill gates'}, console.log);
  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
  sleep(2000).then(() => {
    processed_article_search_response = process_article_search_response();

    io.on('connection', function (socket) {
      console.log("New socket client connection: ", socket.id);
      socket.emit('dataReceivedEvent', { description: processed_article_search_response});
    }, 4000);

    res.render("index");
  });

});

var article_search_api_response;
const set_article_search_response = function(response) {
  article_search_api_response = JSON.parse(response);
  console.log(article_search_api_response);
}

const process_article_search_response = function() {
  let list_of_objects = article_search_api_response.response.docs;
  let pretty_string = "";
  for (let i = 0; i<list_of_objects.length; i++)
    {
      pretty_string += "[" + i + "]" + list_of_objects[i].abstract;
    }
  return pretty_string;
}

app.use("/", router);

// tell our app where to serve our static files
app.use(express.static('public'));


/*
const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(`{"message": "This is a JSON response"}`);
};
*/

