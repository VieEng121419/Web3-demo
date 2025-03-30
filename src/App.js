import "./index.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WalletConnect from "./components/WalletConnect";
import Web3Provider from "./components/Web3Provider";

export default function App() {
  return (
    <Web3Provider>
      <div className="wrapper" style={{ width: "100%", height: "100vh" }}>
        <div className="center-absolute max-h-screen">
          <WalletConnect />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Web3Provider>
  );
}
