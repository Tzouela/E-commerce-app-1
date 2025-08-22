document.addEventListener("DOMContentLoaded", function () {
  const brandModalEl = document.getElementById("brandModal");
  const brandForm = document.getElementById("brandForm");
  const modalTitle = document.getElementById("brandModalLabel");
  const methodOverrideContainer = document.getElementById("methodOverrideContainer");
  const saveBtn = document.getElementById("modalSaveBtn");

  brandModalEl.addEventListener("show.bs.modal", function (event) {
    const triggerBtn = event.relatedTarget;
    if (!triggerBtn) return;

    const mode = triggerBtn.getAttribute("data-mode");

    if (mode === "create") {

      modalTitle.textContent = "Create New Brand";

      brandForm.action = "/brands";
      brandForm.method = "POST";

      methodOverrideContainer.innerHTML = "";

      document.getElementById("brand-id").value = "";
      document.getElementById("brand-name").value = "";

      saveBtn.textContent = "Create Brands";

    } else if (mode === "edit") {

      const brandId = triggerBtn.getAttribute("data-id");
      const name = triggerBtn.getAttribute("data-name");

      modalTitle.textContent = "Edit Brand";

      brandForm.action = `/brands/${brandId}?_method=PUT`;
      brandForm.method = "POST";
      methodOverrideContainer.innerHTML =
        '<input type="hidden" name="_method" value="PUT" />';

      document.getElementById("brand-id").value = brandId;
      document.getElementById("brand-name").value = name;

      saveBtn.textContent = "Save Changes";
    }
  });
});