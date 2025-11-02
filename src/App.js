import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './components/pages/home/Home';
import Books from './components/pages/books/BookList';
import Authors from './components/pages/authors/AuthorList';
import Publishers from './components/pages/publishers/PublisherList';
import Categories from './components/pages/categories/CategoryList';
import PageNotFound from './components/pages/PageNotFound';

function App() {
  return (
     <BrowserRouter>
      <Routes>
        {/* Main layout route */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books" element={<BookList />} />
          <Route path="authors" element={<AuthorList />} />
          <Route path="publishers" element={<PublisherList />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
