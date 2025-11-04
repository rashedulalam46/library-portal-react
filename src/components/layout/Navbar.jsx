import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ marginTop: "10px" }}>
      <ul style={{ listStyle: "none", display: "flex", gap: "15px", padding: 0 }}>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/">Home</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/books">Books</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/authors">Authors</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/publishers">Publishers</Link></li>
        <li><Link style={{ color: "white", textDecoration: "none" }} to="/categories">Categories</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
