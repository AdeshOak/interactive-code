import React, { useEffect, useState } from 'react';
import './ThebeNotebook.css';

const ThebeNotebook = () => {
  const [notebookContent, setNotebookContent] = useState(null);
  const [kernelConnected, setKernelConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotebook = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/AdeshOak/interactive-code/main/notebooks/test.ipynb'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const notebook = await response.json();
      console.log('Fetched notebook:', notebook);
      setNotebookContent(notebook);
    } catch (error) {
      console.error('Error fetching notebook:', error);
      setNotebookContent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapThebe = () => {
      if (window.thebelab) {
        console.log('Thebe.js loaded, bootstrapping...');
        window.thebelab.bootstrap();

        window.thebelab.on('status', (event) => {
          console.log('Kernel status event:', event);

          if (event && event.message && event.message.includes('connected')) {
            console.log('Kernel connected!');
            setKernelConnected(true);
          }
        });
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

    fetchNotebook();
  }, []);

  return (
    <div className="thebe-notebook">
      {/* Loading message */}
      {loading && <p>Loading notebook content...</p>}

      {/* Kernel connection status */}
      {!loading && !kernelConnected && <p>Connecting to kernel...</p>}

      {/* Run & Restart buttons */}
      {kernelConnected && (
        <div className="kernel-controls">
          <button onClick={() => window.thebelab.runAllCells()}>Run All</button>
          <button onClick={() => window.thebelab.restartKernel()}>Restart Kernel</button>
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
          requestKernel: true,
          binderOptions: {
            baseUrl: 'https://mybinder.org',
            repo: 'AdeshOak/interactive-code',
            ref: 'main',
            imageName: 'gh/AdeshOak/interactive-code/main',
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
