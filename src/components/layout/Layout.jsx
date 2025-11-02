import React from 'react';  
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
     <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <Header />     
      <Navbar />
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* The current page (Home/About/Contact) will render here */}
      </main>
      <Footer />
    </div>
  );
}
export default Layout;