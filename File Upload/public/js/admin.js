const deleteProduct = (btn) => {
  const productId = btn.parentNode.querySelector("[name=productId]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
  fetch(`/admin/product/${productId}`, {
    method: "delete",
    headers: {
      "csrf-token": csrfToken,
    },
  })
    .then((response) => {
      const productElement = btn.closest(".product-item");
      productElement.parentNode.removeChild(productElement);
    })
    .catch((err) => {
      console.log(err);
    });
};
