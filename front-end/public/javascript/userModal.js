document.addEventListener("DOMContentLoaded", function () {
  const userModalEl = document.getElementById("userModal");
  const userForm = document.getElementById("userForm");
  const methodOverrideContainer = document.getElementById("methodOverrideContainer");
  const saveBtn = document.getElementById("modalSaveBtn");

  const userIdInput = document.getElementById("user-id");
  const roleSelect = document.getElementById("user-role");

  userModalEl.addEventListener("show.bs.modal", function (event) {
    const triggerBtn = event.relatedTarget;
    if (!triggerBtn) return;

    const userId = triggerBtn.getAttribute("data-id");
    const roleId = triggerBtn.getAttribute("data-role-id");

    modalTitle = document.getElementById("userModalLabel");
    modalTitle.textContent = "Change User Role";

    userForm.action = `/users/${userId}?_method=PATCH`;
    userForm.method = "POST";

    methodOverrideContainer.innerHTML =
      '<input type="hidden" name="_method" value="PATCH" />';

    userIdInput.value = userId;

    roleSelect.value = roleId || "";

    saveBtn.textContent = "Save Changes";
  });
});