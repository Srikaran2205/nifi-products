import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrorMessage('Please select a valid CSV file');
      setUploadStatus('error');
      return;
    }

    setFile(selectedFile);
    setUploadStatus('idle');
    setErrorMessage('');

    const text = await selectedFile.text();
    const rows = text.split('\n').filter(row => row.trim());
    const parsedRows = rows.slice(0, 11).map(row =>
      row.split(',').map(cell => cell.trim())
    );
    setPreview(parsedRows);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/products/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadStatus('success');
      setTimeout(() => {
        setFile(null);
        setPreview([]);
        setUploadStatus('idle');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="text-[#0B3D91] dark:text-blue-400" size={32} />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Import Products
          </h2>
        </div>

        <div className="mb-8">
          <label className="block mb-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#0B3D91] dark:hover:border-blue-400 transition-all duration-300 cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Upload className="mx-auto mb-4 text-gray-400 dark:text-gray-500" size={48} />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {file ? file.name : 'Choose a CSV file or drag it here'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                CSV files only
              </p>
            </div>
          </label>
        </div>

        {preview.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview (First 10 Rows)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {preview[0]?.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {preview.slice(1, 11).map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                      {row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3 animate-slideIn">
            <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            <p className="text-green-800 dark:text-green-300 font-medium">
              File uploaded successfully!
            </p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-3 animate-slideIn">
            <XCircle className="text-red-600 dark:text-red-400" size={24} />
            <p className="text-red-800 dark:text-red-300 font-medium">
              {errorMessage || 'Upload failed. Please try again.'}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full sm:w-auto px-8 py-3 bg-[#0B3D91] text-white rounded-lg font-medium hover:bg-[#082d6b] disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Upload File</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
