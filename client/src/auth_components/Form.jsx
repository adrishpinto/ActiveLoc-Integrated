import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_URL;

const FormComponent = () => {
  const [formData, setFormData] = useState({
    customer_code: "test",
    customer_name: "test",
    customer_type: "Business",
    form_filled: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/update-user`, formData, {
        withCredentials: true,
      });
      setFormData({
        customer_code: "",
        customer_name: "",
        customer_type: "Business",
        form_filled: true,
      });
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Form Submission</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Customer Code
            </label>
            <input
              type="text"
              name="customer_code"
              value={formData.customer_code}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Customer Type
            </label>
            <select
              name="customer_type"
              value={formData.customer_type}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            >
              <option value="Business">Business</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormComponent;
