const users = [
  {
    name: "User-1",
  },
  {
    name: "User-2",
  },
];
const requestHandler = (request, response) => {
  const datas = [];
  switch (request.url) {
    case "/users": {
      response.write("<html>");
      response.write("<head><title>Users</title></head>");
      response.write(`<body><ul>
      ${users.map((user) => `<li>${user.name}</li>`).join("")}
          </ul></body>`);
      response.write("</html>");
      response.end();
    }
    case "/create-user": {
      request.addListener("data", (chunk) => {
        datas.push(chunk);
      });
      request.addListener("end", () => {
        const parsedData = Buffer.concat(datas).toString();
        // const user = {
        //   name: parsedData.split("=").at(1).replace("+", " "),
        // };
        //users.push(user);
        response.writeHead(302, {
          Location: "/users",
        });
        response.end();
      });
      break;
    }
    default: {
      response.write("<html>");
      response.write("<head><title>Create User</title></head>");
      response.write(`<body><form action="/create-user" method="POST">
      <input name="username" type="text" /><br />
      <button type="submit">ADD</button>
    </form></body>`);
      response.write("</html>");
      response.end();
    }
  }
};

exports.handler = requestHandler;
