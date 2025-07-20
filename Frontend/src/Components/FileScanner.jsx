import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileScanner = () => {
  const [file, setFile] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Reset states
      setError(null);
      setScanResults(null);
      setFile(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    try {
      setScanning(true);
      setError(null);
      setScanResults(null);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Send file to backend
      const response = await axios.post('http://localhost:3000/api/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setScanResults(response.data.data);
      } else {
        setError(response.data.error || 'Scan failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to scan file');
    } finally {
      setScanning(false);
    }
  };

  const resetScanner = () => {
    setFile(null);
    setScanResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        File Scanner
      </h2>

      <div className="space-y-6">
        {/* File Input Section */}
        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              dark:file:bg-gray-700 dark:file:text-gray-200"
          />
          {file && (
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleScan}
            disabled={!file || scanning}
            className={\`px-4 py-2 rounded-lg font-medium 
              \${!file || scanning
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'} 
              text-white transition-colors\`}
          >
            {scanning ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Scanning...
              </span>
            ) : (
              'Scan File'
            )}
          </button>
          <button
            onClick={resetScanner}
            className="px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Scan Results */}
        {scanResults && (
          <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Scan Results
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-200">Clean</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-100">
                    {scanResults.summary.harmless}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-200">Malicious</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-100">
                    {scanResults.summary.malicious}
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                  <p className="text-sm text-yellow-600 dark:text-yellow-200">Suspicious</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-100">
                    {scanResults.summary.suspicious}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-200">Total Engines</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-100">
                    {scanResults.totalEngines}
                  </p>
                </div>
              </div>

              {/* Detections List */}
              {scanResults.detections.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                    Detected Threats
                  </h4>
                  <div className="bg-white dark:bg-gray-600 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-500">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Engine
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Result
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-600 divide-y divide-gray-200 dark:divide-gray-500">
                          {scanResults.detections.map((detection, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {detection.engine}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                                {detection.result}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileScanner;
