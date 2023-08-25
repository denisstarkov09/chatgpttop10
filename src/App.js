import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from "react";

import "antd/dist/antd.css";
import "./App.css";

import Navbar from "./Navbar";

import Main from './Main';
import Top from './Top';
import Article from './Article';


function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/main" element={<Main />}></Route>
          <Route path="/top" element={<Top />}></Route>
          <Route path='/article/:cate_slug' element={<Article />}></Route>
          <Route path="*" element={<Navigate to="/main" replace />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
