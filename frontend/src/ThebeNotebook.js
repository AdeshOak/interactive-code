import React, { useEffect, useState } from 'react';
import './ThebeNotebook.css';

const ThebeNotebook = () => {
  const [notebookContent, setNotebookContent] = useState(null);
  const [kernelConnected, setKernelConnected] = useState(false); // Track kernel connection
  const [loading, setLoading] = useState(true); // Manage loading state

  // Function to fetch notebook content
  const fetchNotebook = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/AdeshOak/interactive-code/main/notebooks/test.ipynb' // Only one notebook
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notebook = await response.json();
      console.log('Fetched notebook:', notebook); // Log the notebook to verify its content
      setNotebookContent(notebook);
    } catch (error) {
      console.error('Error fetching notebook:', error);
      setNotebookContent(null); // Reset notebook content in case of error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Set up Thebe.js and handle kernel connection
  useEffect(() => {
    const bootstrapThebe = () => {
      if (window.thebelab) {
        console.log('Thebe.js loaded, bootstrapping...');
        window.thebelab.bootstrap();

        // Listen for kernel status event
        window.thebelab.on('status', (event) => {
          console.log('Kernel status event:', event);  // Log the entire event to inspect

          // Check if the event message contains 'connected'
          if (event && event.message && event.message.includes('connected')) {
            console.log('Kernel connected!');
            setKernelConnected(true);  // Set kernel connected status to true
          }
        });
      } else {
        console.error('Thebe.js not loaded.');
      }
    };

    // Load Thebe.js script if not already loaded
    if (!window.thebelab) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/thebelab@latest/lib/index.js';
      script.onload = bootstrapThebe;
      document.body.appendChild(script);
    } else {
      bootstrapThebe();
    }

    fetchNotebook(); // Fetch the notebook on component mount
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="thebe-notebook">
      {/* Loading message and spinner */}
      {loading && (
        <div className="kernel-connecting">
          <p>Loading notebook content...</p>
          <div className="spinner"></div> {/* Add spinner styling in CSS */}
        </div>
      )}

      {/* Kernel connection status */}
      {!loading && !kernelConnected && (
        <div className="kernel-connecting">
          <p>Connecting to kernel...</p>
          <div className="spinner"></div>
        </div>
      )}

      {/* Run & Restart buttons */}
      {kernelConnected && (
        <div className="kernel-controls">
          <button onClick={() => window.thebelab.runAllCells()}>
            Run All
          </button>
          <button onClick={() => window.thebelab.restartKernel()}>
            Restart Kernel
          </button>
        </div>
      )}

      {/* Colab badge link */}
      <div
        dangerouslySetInnerHTML={{
          __html: `<a href="https://colab.research.google.com/gist/AdeshOak/48804e276d03cc156c40deb217a4e185/baml_test.ipynb" target="_blank">
                     <img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/>
                   </a>`,
        }}
      />

      {/* Thebe configuration script */}
      <script type="text/x-thebe-config">
        {JSON.stringify({
          "requestKernel": true,
          "binderOptions": {
            "baseUrl": "https://mybinder.org",
            "repo": "AdeshOak/interactive-code",
            "ref": "main", 
            "imageName": "gh/AdeshOak/interactive-code/main" 
          },
          "codeMirrorConfig": {
            "theme": "abcdef"
          }
        })}
      </script>

      {/* Display notebook cells */}
      {notebookContent ? (
        <div className="notebook-container">
          {notebookContent.cells.map((cell, index) => (
            <div key={index} className="cell-container">
              {cell.cell_type === 'code' ? (
                <div className="code-cell">
                  <pre data-executable="true" data-language="python">
                    {cell.source.join('')}
                  </pre>
                </div>
              ) : (
                <div className="markdown-cell">
                  <pre>{cell.source.join('')}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No notebook content available.</p>
      )}
    </div>
  );
};

export default ThebeNotebook;
