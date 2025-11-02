import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/home/Home';
import BookList from './pages/books/BookList';
import AuthorList from './pages/authors/AuthorList';
import PublisherList from './pages/publishers/PublisherList';
import CategoryList from './pages/categories/CategoryList';
import PageNotFound from './pages/PageNotFound';

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
