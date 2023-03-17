import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { App } from "./components";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { AuthProvider, PostsProvider } from "./providers";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider
        autoDismiss
        autoDismissTimeout={5000}
        placement={"top-left"}
      >
        <AuthProvider>
          <PostsProvider>
            <App />
          </PostsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
