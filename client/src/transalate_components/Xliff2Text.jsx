import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_URL;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("xliffFile", file);

    try {
      const response = await axios.post(
        `${API_URL}/xliff-text`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSourceText(response.data.source.join("\n"));
      setTargetText(response.data.target.join("\n"));
      toast.success("File uploaded succesfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data);
    }
  };

  const downloadSrc = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/xliff-download-src`, 
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "sourceContent.txt";

      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const downloadTgt = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/xliff-download-tgt`, 
        {
          responseType: "blob",
        }
      );

      const blob = response.data;

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "targetContent.txt";

      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="my-20 bg-slate-50 border-black border w-[90%] sm:w-[80%] lg:w-[50%] p-5  mx-auto flex items-center rounded-xl shadow-2xl">
      <div className="w-full">
        <h1 className="my-4 text-3xl text-center w-full font-semibold">
          XLIFF to Text file
        </h1>
        <div className="mb-10 border bg-slate-300 p-2 rounded w-fit mx-auto">
          <p>1. Choose a file and click on upload button</p>
          <p>2. Source and target files will generate</p>

          <p>3. Allowed files - xliff, xml (in some cases)</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-10 sm:space-y-0 sm:space-x-10  sm:flex-row">
          <div className="w-fit ">
            <input
              type="file"
              onChange={handleFileChange}
              className="border bg-slate-100 text-center w-[230px] "
            />
          </div>
          <button
            className="bg-slate-100 px-3 py-1 border border-black rounded-xl w-fit "
            onClick={handleUpload}
          >
            Upload
          </button>
        </div>
        <div className="mx-auto mt-10 w-fit">
          {/* buttons for download */}
          <div className="mb-10">
            {sourceText && (
              <button
                className="bg-blue-200 m-3 p-1 px-2 rounded-xl"
                onClick={downloadSrc}
              >
                Download Source Content
              </button>
            )}
            {sourceText && (
              <button
                className="bg-blue-200 m-3 p-1 px-2 rounded-xl"
                onClick={downloadTgt}
              >
                Download target Content
              </button>
            )}
          </div>
          {/* source and target text */}
          {message && <p>{message}</p>}
          {sourceText && (
            <div>
              <h1>Source Text: </h1>
              <div className="bg-slate-100  mb-10 p-4 rounded-lg">
                <pre>{sourceText}</pre>
              </div>
            </div>
          )}
          {targetText && (
            <div>
              <h1>Target Text: </h1>
              <div className="bg-slate-100  mb-10 p-4 rounded-lg">
                <pre>{targetText}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
