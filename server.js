const http = require("http");
const app = require("./index");

const port = process.env.port || 3000;
const server = http.createServer(app);

server.listen(port, function() {
  console.log("Server is started");
});
