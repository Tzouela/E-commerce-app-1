document.addEventListener("DOMContentLoaded", function () {
  const productModalEl = document.getElementById("productModal");
  const productForm = document.getElementById("productForm");
  const modalTitle = document.getElementById("productModalLabel");
  const methodOverrideContainer = document.getElementById("methodOverrideContainer");
  const saveBtn = document.getElementById("modalSaveBtn");

  productModalEl.addEventListener("show.bs.modal", function (event) {
    const triggerBtn = event.relatedTarget;
    if (!triggerBtn) return;

    const mode = triggerBtn.getAttribute("data-mode");

    if (mode === "create") {

      modalTitle.textContent = "Create New Product";

      productForm.action = "/products/create";
      productForm.method = "POST";

      methodOverrideContainer.innerHTML = "";

      document.getElementById("product-id").value = "";
      document.getElementById("product-imgurl").value = "";
      document.getElementById("product-name").value = "";
      document.getElementById("product-description").value = "";
      document.getElementById("product-price").value = "";
      document.getElementById("product-quantity").value = "";
      document.getElementById("product-brand").value = "";
      document.getElementById("product-category").value = "";

      saveBtn.textContent = "Create Product";
    } else if (mode === "edit") {

      const productId = triggerBtn.getAttribute("data-id");
      const imageUrl = triggerBtn.getAttribute("data-image-url");
      const name = triggerBtn.getAttribute("data-name");
      const description = triggerBtn.getAttribute("data-description");
      const price = triggerBtn.getAttribute("data-price");
      const quantity = triggerBtn.getAttribute("data-quantity");
      const brandName = triggerBtn.getAttribute("data-brand-name");
      const categoryName = triggerBtn.getAttribute("data-category-name");

      modalTitle.textContent = "Edit Product";

      productForm.action = `/products/${productId}?_method=PUT`;
      productForm.method = "POST";
      methodOverrideContainer.innerHTML =
        '<input type="hidden" name="_method" value="PUT" />';

      document.getElementById("product-id").value = productId;
      document.getElementById("product-imgurl").value = imageUrl;
      document.getElementById("product-name").value = name;
      document.getElementById("product-description").value = description;
      document.getElementById("product-price").value = price;
      document.getElementById("product-quantity").value = quantity;
      document.getElementById("product-brand").value = brandName;
      document.getElementById("product-category").value = categoryName;

      saveBtn.textContent = "Save Changes";
    }
  });
});