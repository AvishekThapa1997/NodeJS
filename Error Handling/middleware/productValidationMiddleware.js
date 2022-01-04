const { validationResult } = require("express-validator");
const { separateValidationError } = require("../util/util");
exports.productValidationMiddleware = (req, res, next) => {
  const isEditing = req.url === "/edit-product";
  const { productId: id, title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validatonErrors = separateValidationError(
      errors.array({
        onlyFirstError: true,
      })
    );
    return res.status(422).render("admin/edit-product", {
      pageTitle: isEditing ? "Edit Product" : "Add Product",
      path: isEditing ? "/admin/edit-product" : "/admin/add-product",
      editMode: req.url === "/edit-product",
      product: { id, title, imageUrl, price, description },
      validatonErrors: validatonErrors,
      errorMessage: errors
        .array({
          onlyFirstError: true,
        })
        ?.at(0)?.msg,
    });
  }
  next();
};
