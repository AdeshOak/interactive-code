import React, { useEffect, useState } from 'react';
import './ThebeNotebook.css';

const ThebeNotebook = () => {
  const [notebookContent, setNotebookContent] = useState(null);
  const defaultNotebook = 'test.ipynb'; // Default notebook

  // Function to fetch notebook content
  const fetchNotebook = async () => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/AdeshOak/interactive-code/main/${defaultNotebook}`
      );
      const notebook = await response.json();
      setNotebookContent(notebook);
    } catch (error) {
      console.error('Error fetching notebook:', error);
    }
  };

  useEffect(() => {
    fetchNotebook(); // Fetch the default notebook

    const bootstrapThebe = () => {
      if (window.thebelab) {
        console.log('Thebe.js loaded, bootstrapping...');
        window.thebelab.bootstrap();
      } else {
        console.error('Thebe.js not loaded.');
      }
    };

    if (!window.thebelab) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/thebelab@latest/lib/index.js';
      script.onload = bootstrapThebe;
      document.body.appendChild(script);
    } else {
      bootstrapThebe();
    }
  }, []);

  return (
    <div className="thebe-notebook">
      <h1>Interactive Jupyter Notebook</h1>

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
          requestKernel: true,
          binderOptions: {
            repo: "AdeshOak/interactive-code",
            ref: "main",
          },
          mountActivateWidget: true,
          mountStatusWidget: true,
          codeMirrorConfig: {
            theme: 'abcdef',
          },
        })}
      </script>

      <div id="thebe-activate" className="thebe-activate"></div>
      <div id="thebe-status" className="thebe-status"></div>

      {/* Display notebook cells */}
      {notebookContent ? (
        <div className="notebook-container">
          {notebookContent.cells.map((cell, index) => (
            <div key={index} className="cell-container">
              {cell.cell_type === 'code' ? (
                <pre data-executable="true" data-language="python">
                  {cell.source.join('')}
                </pre>
              ) : (
                <div className="markdown-cell">
                  <pre>{cell.source.join('')}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading notebook content...</p>
      )}
    </div>
  );
};

export default ThebeNotebook;
