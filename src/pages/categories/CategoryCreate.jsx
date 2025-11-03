import React, { useEffect, useState, useRef } from "react";
import { addCategory as createCategory, updateCategory } from "../../services/CategoryService";
import { showAlert } from "../../utils/alertService";

function CategoryCreate({ show, onHide, category, onSaveSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const initializedRef = useRef(false);

  // Load category data
  useEffect(() => {
    if (category) {
      setName(category.category_name || "");
      setDescription(category.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [category, show]);

  // Initialize Bootstrap modal once
  useEffect(() => {
    if (!modalRef.current || initializedRef.current) return;

    bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
      backdrop: "static",
      keyboard: true,
    });

    const handleHidden = () => onHide();
    modalRef.current.addEventListener("hidden.bs.modal", handleHidden);

    initializedRef.current = true;

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener("hidden.bs.modal", handleHidden);
      }
    };
  }, [onHide]);

  // Show or hide modal when `show` changes
  useEffect(() => {
    if (!bsModalRef.current) return;
    if (show) bsModalRef.current.show();
    else {
      bsModalRef.current.hide();
      removeBackdrop();
    }
  }, [show]);

  const removeBackdrop = () => {
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) backdrop.remove();
    document.body.classList.remove("modal-open");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      category_id: category ? category.category_id : undefined,
      category_name: name.trim(),
      description: description.trim(),
    };

    try {
      if (category) {
        await updateCategory(category.category_id, payload);
        showAlert("Category updated successfully!", "success");
      } else {
        await createCategory(payload);
        showAlert("Category created successfully!", "success");
      }

      setSaving(false);
      if (bsModalRef.current) bsModalRef.current.hide();
      removeBackdrop();
      onSaveSuccess();
    } catch (err) {
      setSaving(false);
      showAlert(err.response?.data?.message || err.message || "Failed to save category", "danger");
    }
  };

  return (
    <div
      className="modal fade"
      ref={modalRef}
      id="categoryModal"
      tabIndex="-1"
      aria-labelledby="categoryModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="categoryModalLabel">
              {category ? "Edit Category" : "Add Category"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="text-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  data-bs-dismiss="modal"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : category ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryCreate;
