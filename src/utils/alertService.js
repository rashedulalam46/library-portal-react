// src/utils/alertService.js
export function showAlert(message, type = "success", timeout = 3000) {
  let wrapper = document.getElementById("alert-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "alert-wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.top = "20px";
    wrapper.style.right = "20px";
    wrapper.style.zIndex = 1055;
    document.body.appendChild(wrapper);
  }

  const alert = document.createElement("div");
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = "alert";
  alert.style.minWidth = "250px";
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  wrapper.appendChild(alert);

  setTimeout(() => {
    alert.classList.remove("show");
    alert.classList.add("hide");
    setTimeout(() => alert.remove(), 150);
  }, timeout);
}

/**
 * Show a Yes/No confirmation dialog.
 * Returns a Promise that resolves to true (Yes) or false (No)
 */
export function showConfirm(message, title = "Confirm") {
  return new Promise((resolve) => {
    // Create modal wrapper
    let wrapper = document.getElementById("confirm-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.id = "confirm-wrapper";
      document.body.appendChild(wrapper);
    }

    wrapper.innerHTML = `
      <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="confirmModalLabel">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">${message}</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="confirmNoBtn">No</button>
              <button type="button" class="btn btn-primary" id="confirmYesBtn">Yes</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modalEl = document.getElementById("confirmModal");
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();

    // Handle Yes
    const yesBtn = document.getElementById("confirmYesBtn");
    const noBtn = document.getElementById("confirmNoBtn");

    const cleanup = () => {
      modal.hide();
      modalEl.remove();
      resolve(false);
    };

    yesBtn.onclick = () => {
      modal.hide();
      resolve(true);
    };

    noBtn.onclick = cleanup;

    modalEl.addEventListener("hidden.bs.modal", cleanup, { once: true });
  });
}
