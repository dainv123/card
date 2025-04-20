import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

// Import cái HÀM tạo store
import configureStoreFunction from './config/configureStore'; // Đổi tên import cho rõ ràng

import client from './config/createApolloClient'; // Import client Apollo
import App from './App'; // Import component App

// --- BƯỚC SỬA LỖI: GỌI HÀM ĐÃ IMPORT ĐỂ TẠO RA ĐỐI TƯỢNG STORE THỰC TẾ ---
const reduxStore = configureStoreFunction(); // Gọi hàm để lấy đối tượng store

const Root = () => {
  return (
    // --- SỬ DỤNG ĐỐI TƯỢNG STORE ĐÃ TẠO TRUYỀN VÀO PROP 'store' ---
    <Provider store={reduxStore}>
      <ApolloProvider client={client}>
        {/*
          BrowserRouter nên bọc các components sử dụng các hook/component của React Router.
          Vị trí hiện tại (bên trong Provider và ApolloProvider) là đúng.
        */}
        <BrowserRouter>
          <App /> {/* Component App chứa Routes */}
        </BrowserRouter>
      </ApolloProvider>
    </Provider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);