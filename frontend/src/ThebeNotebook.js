import React, { useEffect, useState } from 'react';
import './ThebeNotebook.css';

const ThebeNotebook = () => {
  const [notebookContent, setNotebookContent] = useState(null);
  const [selectedNotebook, setSelectedNotebook] = useState('test.ipynb'); // Default notebook

  // Function to fetch notebook content
  const fetchNotebook = async (notebookName) => {
    try {
      const response = await fetch(
        `https://raw.githubusercontent.com/AdeshOak/interactive-code/main/notebooks/${notebookName}`
        
      );
      const notebook = await response.json();
      setNotebookContent(notebook);
    } catch (error) {
      console.error('Error fetching notebook:', error);
    }
  };

  useEffect(() => {
    fetchNotebook(selectedNotebook); // Fetch the selected notebook

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
  }, [selectedNotebook]);

  return (
    <div className="thebe-notebook">
      <h1>Interactive Jupyter Notebook</h1>

      {/* Dropdown to select notebook */}
      <select
        value={selectedNotebook}
        onChange={(e) => setSelectedNotebook(e.target.value)}
      >
        <option value="test.ipynb">Notebook 1</option>
        <option value="test1.ipynb">Notebook 2</option>
        {/* Add more notebooks here */}
      </select>

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
          codeMirrorConfig: {
            theme: 'abcdef',
          },
        })}
      </script>
      

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
