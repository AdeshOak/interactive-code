import React, { useEffect } from "react";

const ThebeNotebook = () => {
  useEffect(() => {
    const initThebe = () => {
      // Check if Thebe is available after script load
      if (window.Thebe) {
        window.Thebe.bootstrap({
          binderOptions: {
            repo: "AdeshOak/interactive-code", // Replace with your repo name
            ref: "main", // Replace with the branch name
          },
          kernelName: "python3", // Set the kernel to Python
        });
      } else {
        console.error("Thebe is not loaded properly.");
      }
    };

    // Ensure Thebe script is fully loaded before calling bootstrap
    const script = document.createElement("script");
    script.src = "https://unpkg.com/thebe@latest/lib/thebe.js";
    script.async = true;
    script.onload = initThebe; // Only initialize Thebe after the script is loaded
    document.body.appendChild(script); // Append the script to the body of the page

    return () => {
      document.body.removeChild(script); // Clean up by removing the script when the component is unmounted
    };
  }, []);

  return (
    <div>
      <h1>Interactive Jupyter Notebook</h1>
      <div className="cell">
        <pre data-executable="true" data-thebe-cell-type="code">
          print("Hello from Thebe.js!")
        </pre>
      </div>
    </div>
  );
};

export default ThebeNotebook;
