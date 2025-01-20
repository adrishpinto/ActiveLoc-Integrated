import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import Routes and Route
import { ToastContainer } from "react-toastify"; // Import ToastContainer


import Login from "./auth_components/Login.jsx";
import Google from "./auth_components/Google.jsx";
import Form from "./auth_components/Form.jsx";
import TranslateDev from "./transalate_components/TranslateDev.jsx";

function App() {
  return (
    <BrowserRouter>
      {/* ToastContainer placed here to be accessible across all routes */}
      <ToastContainer />
      
      <Routes>
        {/* <Route path="/" element={<SignIn />} /> */}
        <Route path="/google" element={<Google />} />
        <Route path="/t" element={<TranslateDev />} />
        <Route path="/form" element={<Form />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
