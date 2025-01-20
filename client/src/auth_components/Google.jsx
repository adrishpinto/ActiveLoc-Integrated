import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

function Google() {
  const navigate = useNavigate();

  const responseMessage = async (response) => {
    const userInfo = jwtDecode(response.credential);
    const userEmail = userInfo.email;

    console.log("User Email:", userEmail);

    try {
      const { data } = await axios.get(`${API_URL}/check-email`, {
        params: { email: userEmail },
      });

      if (data.exists) {
        console.log("Email exists in the database");
        navigate("/home");
      } else {
        console.log("Email does not exist in the database");
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const errorMessage = (error) => {
    console.log("Login Failed:", error);
  };

  return (
    <div className="sm:w-[399px] w-full rounded-xl mx-auto">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    </div>
  );
}

export default Google;
