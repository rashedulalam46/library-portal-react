import React, { useEffect, useState, useRef } from "react";
import { addPublisher as createPublisher, updatePublisher } from "../../services/PublisherService";
import { showAlert } from "../../utils/alertService";


function AuthorCreate({ show, onHide, author, onSaveSuccess }) {
  const [author_name, setAuthorName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const initializedRef = useRef(false);

  // Load author data
  useEffect(() => {
    if (author) {
      setAuthorName(author.author_name || "");
      setCountry(author.country || "");
      setAddress(author.address || "");
      setPhone(author.phone || "");
      setEmail(author.email || "");
    } else {
      setAuthorName("");
      setCountry("");
      setAddress("");
      setPhone("");
      setEmail("");
    }
  }, [author, show]);

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
      author_id: author ? author.author_id : undefined,
      author_name: author_name.trim(),
      country: country.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    try {
      if (author) {
        await updatePublisher(author.author_id, payload);
        showAlert("Author updated successfully!", "success");
      } else {
        await createPublisher(payload);
        showAlert("Author created successfully!", "success");
      }

      setSaving(false);
      if (bsModalRef.current) bsModalRef.current.hide();
      removeBackdrop();
      onSaveSuccess();
    } catch (err) {
      setSaving(false);
      showAlert(err.response?.data?.message || err.message || "Failed to save author", "danger");
    }
  };

  return (
    <div
      className="modal fade"
      ref={modalRef}
      id="authorModal"
      tabIndex="-1"
      aria-labelledby="authorModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="authorModalLabel">
              {author ? "Edit Author" : "Add Author"}
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
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={author_name}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>

               <div className="mb-3">
                <label className="form-label">Country</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
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
                  {saving ? "Saving..." : author ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AuthorCreate;