import React, { useEffect } from "react";

const ThebeNotebook = () => {
  useEffect(() => {
    // Initialize Thebe after the component has mounted
    const initThebe = async () => {
      // Check if Thebe is available globally
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

    initThebe();
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
