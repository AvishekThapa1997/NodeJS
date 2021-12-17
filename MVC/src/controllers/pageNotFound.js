const pageNotFound = (request, response) => {
  // response
  //   .status(404)
  //   .sendFile(path.join(dirName, "views", "html", "pageNotFound.html"));
  // const viewPath = path.join("pug", "pageNotFound");
  response.status(404).render("pageNotFound", {
    pageTitle: "Not Found",
    path: "",
  });
};
module.exports = pageNotFound;
