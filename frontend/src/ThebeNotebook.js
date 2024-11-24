import React, { useEffect } from "react";

const ThebeNotebook = () => {
  useEffect(() => {
    const initThebe = async () => {
      const thebe = await import("thebe");

      // Ensure Thebe is initialized properly
      if (thebe && thebe.thebelab) {
        thebe.thebelab.bootstrap({
          binderOptions: {
            repo: "AdeshOak/interactive-code", // Replace with your repo name
            ref: "main", // Replace with the branch name
          },
          kernelName: "python3",
        });

        // You can also check if thebe was initialized successfully by adding a log
        console.log("Thebe initialized successfully");
      } else {
        console.error("Thebe failed to initialize");
      }
    };

    initThebe();
  }, []);

  return (
    <div>
      <div className="cell">
        {/* Add your code block here */}
        <pre data-executable="true" data-thebe-cell-type="code">
          print("Hello from Thebe.js!")
        </pre>
      </div>
    </div>
  );
};

export default ThebeNotebook;
