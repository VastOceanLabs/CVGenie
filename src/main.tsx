import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple App component for now
function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🚀 FreeResume Builder</h1>
      <p>React is working! Ready to build your resume.</p>
      <button style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
        Start Building
      </button>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);