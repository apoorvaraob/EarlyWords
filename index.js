const express = require('express');
const app     = express();
const PORT    = process.env.PORT || 5000;
const server  = require('http').createServer(app);
const io      = require('socket.io')(server);
const path = require("path");
const router = express.Router();

// --------------------------------------------------------
// tell our app where to listen for connections
server.listen(PORT, () => {
  console.log('Listening on PORT ' + PORT);
});

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/views"));

router.get("/", (req, res) => {
    res.render("index");
});

app.use("/", router);
// tell our app where to serve our static files
app.use(express.static('public'));

