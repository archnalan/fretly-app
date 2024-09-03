import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./Pages/Page";
import AdminLayout from "./AdminLayout";
import PageCreate from "./Pages/PageCreate/PageCreate";
import PageEdit from "./Pages/PageEdit/PageEdit";
import PageDetails from "./Pages/PageDetails";
import Category from "./Categories/Category";
import SongBook from "./Collections/SongBook";
import Song from "./Songs/Song";
import Dashboard from "./Pages/Dashboard/Dashboard";
import CategoryDetails from "./Categories/CategoryDetails";
import BookDetails from "./Collections/BookDetails";
import SongDetails from "./Songs/SongDetails";

const AdminRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />}></Route>
          {/* pages */}
          <Route path="pages" element={<Page />}></Route>
          <Route path="pages/create" element={<PageCreate />}></Route>
          <Route path="pages/:id" element={<PageDetails />}></Route>
          <Route path="pages/edit/:id" element={<PageEdit />}></Route>
          {/* categories */}
          <Route path="categories" element={<Category />}></Route>
          <Route path="categories/:id" element={<CategoryDetails />}></Route>
          {/* <Route path="categories/create" element={<PageCreate />}></Route>
          <Route path="categories/edit/:id" element={<PageEdit />}></Route> */}
          {/* songbooks */}
          <Route path="songbooks" element={<SongBook />}></Route>
          <Route path="songbooks/:id" element={<BookDetails />}></Route>
          {/* <Route path="songbooks/create" element={<PageCreate />}></Route>
          <Route path="songbooks/edit/:id" element={<PageEdit />}></Route> */}
          {/* songs */}
          <Route path="songs" element={<Song />}></Route>
          <Route path="songs/:id" element={<SongDetails />}></Route>
          {/* <Route path="songs/create" element={<PageCreate />}></Route>
          <Route path="songs/edit/:id" element={<PageEdit />}></Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
