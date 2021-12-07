const http = require("http");

const router = require("./router");
const server = http.createServer(router.handler);
server.listen(3000, () => {
  console.log("Server Started at PORT 3000");
});
