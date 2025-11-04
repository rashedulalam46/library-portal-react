import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#282c34", color: "white", padding: "10px", textAlign: "center" }}>
      <p>© {new Date().getFullYear()} Library Portal. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
