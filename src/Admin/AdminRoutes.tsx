import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Page from "./Pages/Page";
import AdminLayout from "./AdminLayout";
import PageCreate from "./Pages/PageCreate/PageCreate";
import PageEdit from "./Pages/PageEdit/PageEdit";
import PageDetails from "./Pages/PageDetails";

const AdminRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="pages" element={<Page />}></Route>
          <Route path="pages/create" element={<PageCreate />}></Route>
          <Route path="pages/:id" element={<PageDetails />}></Route>
          <Route path="pages/edit/:id" element={<PageEdit />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AdminRoutes;
