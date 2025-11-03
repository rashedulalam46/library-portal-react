import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  deleteCategory as deleteCategoryApi
} from "../../services/CategoryService";


function CategoryList() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   
    // Fetch authors
    useEffect(() => {
      let mounted = true;
      setLoading(true);
      setError(null);

      getCategories()
        .then(res => {
          if (!mounted) return;
          // axios returns response.data usually; adjust if your service returns differently
          setCategories(res.data || []);
        })
        .catch(err => {
          if (!mounted) return;
          setError(err.response?.data?.message || err.message || "Failed to load categories");
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
  
      return () => {
        mounted = false;
      };
    }, []);
  
    // Delete handler
    const handleDelete = async (id) => {
      const ok = window.confirm("Are you sure you want to delete this author?");
      if (!ok) return;
  
      try {
        await deleteCategoryApi(id);
        // remove from UI
        setCategories(prev => prev.filter(c => c.id !== id && c.category_id !== id)); // try both id shapes
      } catch (err) {
        alert(err.response?.data?.message || err.message || "Delete failed");
      }
    };
  

    
  return (
      <div className="category-list">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Categories</h2>
            <Link to="/categories/add" className="btn btn-primary">Add Category</Link>
          </div>
    
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border" role="status" aria-hidden="true"></div>
              <div className="mt-2">Loading authors...</div>
            </div>
          )}
    
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
    
          {!loading && !error && (
            <>
              {categories.length === 0 ? (
                <div className="alert alert-info">No authors found.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>                                    
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((category, idx) => {
                        // adapt properties depending on your API shape
                        const id = category.categoryId;
                        return (
                          <tr key={id || idx}>
                            <td>{category.category_id}</td>
                            <td>{category.category_name}</td>
                            <td>{category.description}</td>                                           
                            <td className="text-end">
                              <Link to={`/authors/${id}`} className="btn btn-sm btn-outline-info me-2">
                                View
                              </Link>
                              <Link to={`/authors/edit/${id}`} className="btn btn-sm btn-outline-secondary me-2">
                                Edit
                              </Link>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
  );
}

export default CategoryList;
