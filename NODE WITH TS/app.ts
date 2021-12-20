import http from "http";
const server = http.createServer((req, res) => {
  console.log(req.url);
  res.end();
});
server.listen(3000, () => {
  console.log("Server Started");
});
