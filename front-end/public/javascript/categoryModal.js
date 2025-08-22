document.addEventListener("DOMContentLoaded", function () {
  const categoryModalEl = document.getElementById("categoryModal");
  const categoryForm = document.getElementById("categoryForm");
  const modalTitle = document.getElementById("categoryModalLabel");
  const methodOverrideContainer = document.getElementById("methodOverrideContainer");
  const saveBtn = document.getElementById("modalSaveBtn");

  categoryModalEl.addEventListener("show.bs.modal", function (event) {
    const triggerBtn = event.relatedTarget;
    if (!triggerBtn) return;

    const mode = triggerBtn.getAttribute("data-mode");

    if (mode === "create") {

      modalTitle.textContent = "Create New Category";

      categoryForm.action = "/categories";
      categoryForm.method = "POST";

      methodOverrideContainer.innerHTML = "";

      document.getElementById("category-id").value = "";
      document.getElementById("category-name").value = "";

      saveBtn.textContent = "Create Categories";

    } else if (mode === "edit") {

      const categoryId = triggerBtn.getAttribute("data-id");
      const name = triggerBtn.getAttribute("data-name");

      modalTitle.textContent = "Edit Category";

      categoryForm.action = `/categories/${categoryId}?_method=PUT`;
      categoryForm.method = "POST";
      methodOverrideContainer.innerHTML =
        '<input type="hidden" name="_method" value="PUT" />';

      document.getElementById("category-id").value = categoryId;
      document.getElementById("category-name").value = name;

      saveBtn.textContent = "Save Changes";
    }
  });
});