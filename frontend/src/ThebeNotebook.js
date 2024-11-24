import React, { useEffect } from "react";

const ThebeNotebook = () => {
  useEffect(() => {
    const initThebe = async () => {
      try {
        const thebe = await import("thebe");
        
        // Check if Thebe is properly loaded
        if (thebe && thebe.thebelab) {
          console.log("Thebe loaded successfully!");

          thebe.thebelab.bootstrap({
            binderOptions: {
              repo: "AdeshOak/interactive-code", // Replace with your repo name
              ref: "main", // Replace with the branch name
            },
            kernelName: "python3",
          });
        } else {
          console.error("Failed to load Thebe.js");
        }
      } catch (error) {
        console.error("Error initializing Thebe:", error);
      }
    };
    initThebe();
  }, []);

  return (
    <div>
      <div className="cell">
        <pre data-executable="true" data-thebe-cell-type="code">
          print("Hello from Thebe.js!")
        </pre>
      </div>
    </div>
  );
};

export default ThebeNotebook;
