import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getBooks,
  deleteBook as deleteBookApi
} from "../../services/BookService";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getBooks()
      .then(res => {
        if (!mounted) return;
        // axios returns response.data usually; adjust if your service returns differently
        setBooks(res.data || []);
      })
      .catch(err => {
        if (!mounted) return;
        setError(err.response?.data?.message || err.message || "Failed to load books");
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
    const ok = window.confirm("Are you sure you want to delete this publisher?");
    if (!ok) return;

    try {
      await deleteBookApi(id);
      // remove from UI
      setBooks(prev => prev.filter(c => c.book_id !== id)); // try both id shapes
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Delete failed");
    }
  };


    
  return (
   <div className="book-list">
         <div className="d-flex justify-content-between align-items-center mb-3">
           <h2>Books</h2>
           <Link to="/books/add" className="btn btn-primary">Add Book</Link>
         </div>
   
         {loading && (
           <div className="text-center py-4">
             <div className="spinner-border" role="status" aria-hidden="true"></div>
             <div className="mt-2">Loading books...</div>
           </div>
         )}
   
         {error && (
           <div className="alert alert-danger" role="alert">
             {error}
           </div>
         )}
   
         {!loading && !error && (
           <>
             {books.length === 0 ? (
               <div className="alert alert-info">No books found.</div>
             ) : (
               <div className="table-responsive">
                 <table className="table table-striped table-hover">
                   <thead className="table-dark">
                     <tr>
                       <th>ID</th>
                       <th>Title</th>
                       <th>Description</th>
                       <th>Author Name</th>
                       <th>Category Name</th>
                       <th>Publisher Name</th>
                       <th className="text-end">Actions</th>
                     </tr>
                   </thead>
                   <tbody>
                     {books.map((book, idx) => {
                       // adapt properties depending on your API shape
                       const id = book.book_id;
                       return (
                         <tr key={id || idx}>
                           <td>{book.title}</td>
                           <td>{book.description}</td>
                           <td>{book.author_name}</td>
                           <td>{book.category_name}</td>
                           <td>{book.publisher_name}</td>
                           <td className="text-end">
                             <Link to={`/books/${id}`} className="btn btn-sm btn-outline-info me-2">
                               View
                             </Link>
                             <Link to={`/books/edit/${id}`} className="btn btn-sm btn-outline-secondary me-2">
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

export default BookList;