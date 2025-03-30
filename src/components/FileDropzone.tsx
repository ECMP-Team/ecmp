"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { motion } from "framer-motion";

interface Lead {
  name: string;
  email: string;
  company: string;
  domain?: string;
  notes?: string;
}

interface FileDropzoneProps {
  onFileProcess: (data: Lead[]) => void;
  isGenerating: boolean;
}

interface ParseResult {
  data: Record<string, any>[];
  errors: { message: string }[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileProcess,
  isGenerating,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      setIsProcessing(true);

      const file = acceptedFiles[0];
      if (!file) {
        setError("No file selected");
        setIsProcessing(false);
        return;
      }

      // Validate file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Only CSV files are supported");
        setIsProcessing(false);
        return;
      }

      Papa.parse(file, {
        header: true,
        complete: (results: ParseResult) => {
          try {
            // Validate structure and map to Lead objects
            const jsonData: Record<string, any>[] = results.data;
            const leads = jsonData
              .filter(
                (row) =>
                  row.name &&
                  row.email &&
                  row.company &&
                  Object.keys(row).length > 0
              )
              .map(
                (row): Lead => ({
                  name: row.name,
                  email: row.email,
                  company: row.company,
                  domain: row.domain || "",
                  notes: row.notes || "",
                })
              );

            if (leads.length === 0) {
              setError(
                "CSV file must contain valid lead data with name, email, and company columns"
              );
            } else {
              onFileProcess(leads);
            }
          } catch (err) {
            setError("Failed to process file. Please check the format");
            console.error(err);
          } finally {
            setIsProcessing(false);
          }
        },
        error: (err: { message: string }) => {
          setError(`Failed to parse CSV: ${err.message}`);
          setIsProcessing(false);
        },
      });
    },
    [onFileProcess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    disabled: isGenerating || isProcessing,
    maxFiles: 1,
  });

  const downloadSampleTemplate = () => {
    const csvContent =
      "name,email,company,domain,notes\nJohn Doe,john@example.com,Example Corp,example.com,Interested in email marketing\nJane Smith,jane@acme.com,Acme Inc,acme.com,Previously used competitor product";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "sample_leads.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        {...getRootProps()}
        className={`flex-1 h-full flex flex-col items-center justify-center p-6 border-2 apple-radius transition-colors duration-200 cursor-pointer ${
          isDragActive
            ? "border-cyber-green border-dashed bg-cyber-green/5"
            : "border-dashed border-gray-700 hover:border-cyber-green/50"
        } ${
          isGenerating || isProcessing ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} />

        {isProcessing ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full mx-auto mb-3"
            />
            <p className="text-cyber-green">Processing your file...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-cyber-green">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="mb-1 font-medium text-center">
              {isDragActive
                ? "Drop your CSV file here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-sm text-text-secondary text-center mb-4">
              Upload a CSV file with lead data
            </p>

            <div className="w-full max-w-sm mx-auto px-2">
              <div className="flex items-center mb-2">
                <div className="h-0.5 flex-grow bg-gray-800"></div>
                <span className="text-xs text-text-secondary mx-3">
                  COLUMNS
                </span>
                <div className="h-0.5 flex-grow bg-gray-800"></div>
              </div>

              <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-cyber-green mr-2"></div>
                  <span>name</span>
                </div>

                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-cyber-green mr-2"></div>
                  <span>email</span>
                </div>

                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-cyber-green mr-2"></div>
                  <span>company</span>
                </div>

                <div className="flex items-center text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-gray-600 mr-2"></div>
                  <span>domain</span>
                </div>

                <div className="flex items-center text-text-secondary">
                  <div className="w-1.5 h-1.5 bg-gray-600 mr-2"></div>
                  <span>notes</span>
                </div>
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="mt-3 text-red-400 text-sm bg-red-900/20 px-3 py-2 apple-radius border-2 border-red-800">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-3">
        <button
          onClick={downloadSampleTemplate}
          className="text-xs bg-dark-secondary text-cyber-green py-1.5 px-3 border-2 border-gray-800 apple-radius-sm hover:bg-dark-secondary/70 flex items-center gap-1.5 transition-colors"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Download Sample Template
        </button>
      </div>
    </div>
  );
};
