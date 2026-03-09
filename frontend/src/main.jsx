import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import RequestForm from './RequestForm';
import Payment from './Payment';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/request" element={<RequestForm />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
