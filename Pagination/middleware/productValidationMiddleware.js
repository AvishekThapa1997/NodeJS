const { validationResult } = require("express-validator");
const { separateValidationError } = require("../util/util");
const MESSAGE = require("../util/message");
exports.productValidationMiddleware = (req, res, next) => {
  const isEditing = req.url === "/edit-product";
  const { productId: id, title, price, description } = req.body;
  const image = req.file;
  if (!image && !isEditing) {
    return render(
      req,
      res,
      { id, title, price, description },
      MESSAGE.invalidImageFormat
    );
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = separateValidationError(
      errors.array({
        onlyFirstError: true,
      })
    );
    return render(
      req,
      res,
      { id, title, price, description },
      errors
        .array({
          onlyFirstError: true,
        })
        ?.at(0)?.msg,
      validationErrors
    );
  }
  next();
};
const render = (
  req,
  res,
  prevInput = null,
  errorMessage = null,
  validationErrors = {}
) => {
  const isEditing = req.url === "/edit-product";
  res.status(422).render("admin/edit-product", {
    pageTitle: isEditing ? "Edit Product" : "Add Product",
    path: isEditing ? "/admin/edit-product" : "/admin/add-product",
    editMode: isEditing,
    product: prevInput,
    validatonErrors: validationErrors,
    errorMessage: errorMessage,
  });
};
