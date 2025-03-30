"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AIPreviewPanelProps {
  emailContent: {
    subject: string;
    content: string;
  } | null;
  isGenerating: boolean;
  onRegenerateClick: () => void;
  onEditContent: (subject: string, content: string) => void;
}

export const AIPreviewPanel: React.FC<AIPreviewPanelProps> = ({
  emailContent,
  isGenerating,
  onRegenerateClick,
  onEditContent,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "html">("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [editableSubject, setEditableSubject] = useState("");
  const [editableContent, setEditableContent] = useState("");

  useEffect(() => {
    if (emailContent) {
      setEditableSubject(emailContent.subject);
      setEditableContent(emailContent.content);
    }
  }, [emailContent]);

  const handleSaveClick = () => {
    if (editableSubject && editableContent) {
      onEditContent(editableSubject, editableContent);
      setIsEditing(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-dark-secondary/30 apple-radius border-2 border-dashed border-gray-700 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-cyber-green border-t-transparent rounded-full mb-4"
        />
        <p className="text-cyber-green font-medium mb-2">
          Generating Email Content
        </p>
        <p className="text-sm text-text-secondary">
          Using AI to craft the perfect message...
        </p>
      </div>
    );
  }

  if (!emailContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-dark-secondary/30 apple-radius border-2 border-dashed border-gray-700 text-center">
        <div className="mb-4 text-cyber-green">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-white font-medium mb-2">No Email Content Yet</p>
        <p className="text-sm text-text-secondary mb-6">
          Upload your lead data to generate personalized emails
        </p>

        <div className="w-full max-w-sm mx-auto px-2">
          <div className="flex items-center mb-2">
            <div className="h-0.5 flex-grow bg-gray-800"></div>
            <span className="text-xs text-text-secondary mx-3">
              EMAIL FEATURES
            </span>
            <div className="h-0.5 flex-grow bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-cyber-green mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Personalized greeting</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-cyber-green mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Company references</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-cyber-green mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Call to action</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-cyber-green mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Professional format</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-dark-secondary/30 apple-radius overflow-hidden">
      <div className="flex items-center border-b border-gray-800 bg-dark-secondary">
        <button
          className={`px-4 py-3 text-sm ${
            activeTab === "preview"
              ? "text-cyber-green border-b-2 border-cyber-green"
              : "text-text-secondary hover:text-white"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          <div className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Preview
          </div>
        </button>
        <button
          className={`px-4 py-3 text-sm ${
            activeTab === "html"
              ? "text-cyber-green border-b-2 border-cyber-green"
              : "text-text-secondary hover:text-white"
          }`}
          onClick={() => setActiveTab("html")}
        >
          <div className="flex items-center">
            <svg
              className="w-3.5 h-3.5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            HTML
          </div>
        </button>
        <div className="ml-auto flex items-center pr-3">
          {isEditing ? (
            <>
              <button
                className="text-sm px-3 py-1 mr-2 text-text-secondary hover:text-white"
                onClick={() => {
                  setIsEditing(false);
                  if (emailContent) {
                    setEditableSubject(emailContent.subject);
                    setEditableContent(emailContent.content);
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="text-sm px-3 py-1 apple-radius-sm bg-cyber-green/20 border border-cyber-green/40 text-cyber-green hover:bg-cyber-green/30 flex items-center"
                onClick={handleSaveClick}
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save
              </button>
            </>
          ) : (
            <>
              <button
                className="text-sm px-3 py-1 mr-2 text-text-secondary hover:text-white flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </button>
              <button
                className="text-sm px-3 py-1 apple-radius-sm bg-dark-secondary border border-gray-700 text-text-secondary hover:text-white hover:border-gray-600 flex items-center"
                onClick={onRegenerateClick}
              >
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Regenerate
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="text-cyber-green mr-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <label className="text-xs text-text-secondary mr-2">Subject:</label>
          {isEditing ? (
            <input
              type="text"
              className="flex-1 bg-dark-secondary border border-gray-700 apple-radius-sm px-2 py-1 text-white focus:border-cyber-green/50 focus:outline-none"
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
            />
          ) : (
            <p className="text-white font-medium">{emailContent.subject}</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === "preview" ? (
          isEditing ? (
            <textarea
              className="w-full h-full bg-dark-secondary border border-gray-700 apple-radius-sm p-3 text-white focus:border-cyber-green/50 focus:outline-none resize-none"
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
            />
          ) : (
            <div
              className="prose prose-sm max-w-none text-white prose-headings:text-white prose-a:text-cyber-green prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: emailContent.content }}
            />
          )
        ) : (
          <pre className="text-xs text-text-secondary bg-dark-secondary p-3 border border-gray-700 apple-radius-sm whitespace-pre-wrap overflow-x-auto">
            {emailContent.content}
          </pre>
        )}
      </div>

      <div className="border-t border-gray-800 p-2 flex justify-center">
        <button
          className="text-xs bg-dark-secondary text-cyber-green py-1.5 px-3 border border-gray-800 apple-radius-sm hover:bg-dark-secondary/70 flex items-center gap-1.5 transition-colors"
          onClick={() =>
            window.open(
              `data:text/html;charset=utf-8,${encodeURIComponent(
                emailContent.content
              )}`,
              "_blank"
            )
          }
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
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Open Email in New Tab
        </button>
      </div>
    </div>
  );
};
