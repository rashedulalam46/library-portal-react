import React  from "react";

import Navbar from './Navbar';


function Header() {
return (
    <header style={{ backgroundColor: "#282c34", color: "white", padding: "10px" }}>
      <h1 style={{ margin: 0 }}>Library Portal</h1>
      <Navbar /> {/* Moved Navbar inside Header */}
    </header>
  );
}

export default Header;
