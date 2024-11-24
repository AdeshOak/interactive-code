import React, { useEffect } from "react";

const ThebeNotebook = () => {
  useEffect(() => {
    const initThebe = async () => {
      const thebe = await import("thebe");

      thebe.thebelab.bootstrap({
        binderOptions: {
          repo: "AdeshOak/interactive-code", // Replace with your repo name
          ref: "main", // Replace with the branch name
        },
        kernelName: "python3",
      });
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
