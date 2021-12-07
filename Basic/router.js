const fs = require("fs");
const requestHandler = (request, response) => {
  const url = request.url;
  switch (url) {
    case "/message": {
      const datas = [];
      request.addListener("data", (chunk) => {
        datas.push(chunk);
      });
      request.addListener("end", () => {
        const parsedBody = Buffer.concat(datas).toString();
        const message = parsedBody.split("=").at(1).replace("+", " ");
        fs.writeFile("message.txt", message, (err) => {
          response.writeHead(302, {
            Location: "/",
          });
          response.end();
        });
      });
      break;
    }
    default: {
      response.write("<html>");
      response.write("<head><title>Send Message</title></head>");
      response.write(`<body>
    <form action="/message" method="POST">
      <input type="text" name="message"/><br />
      <button type="submit">SEND</button>
    </form>
  </body>`);
      response.write("</html>");
      response.end();
    }
  }
};
exports.handler = requestHandler;
