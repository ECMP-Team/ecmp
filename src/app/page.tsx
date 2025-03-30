"use client";

import React, { useState } from "react";
import { FileDropzone } from "../components/FileDropzone";
import { AIPreviewPanel } from "../components/AIPreviewPanel";
import { Hero } from "../components/Hero";
import { Testimonials } from "../components/Testimonials";
import { VisitorStats } from "../components/VisitorStats";
import { motion } from "framer-motion";
import axios from "axios";

interface Lead {
  name: string;
  email: string;
  company: string;
  domain?: string;
  notes?: string;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailContent, setEmailContent] = useState<{
    subject?: string;
    text?: string;
    html?: string;
  }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<{
    isSending: boolean;
    success: number;
    failed: number;
    message?: string;
  }>({
    isSending: false,
    success: 0,
    failed: 0,
  });

  const handleFileProcessed = (data: Lead[]) => {
    setLeads(data);
    if (data.length > 0) {
      setSelectedLead(data[0]);
      generateEmailContent(data[0]);
    }
  };

  const generateEmailContent = async (lead: Lead) => {
    setIsGenerating(true);
    try {
      // Call the API to generate email content using AI
      const response = await axios.post("/api/generate-email", lead);
      setEmailContent(response.data);
    } catch (error) {
      console.error("Error generating email content:", error);
      // Set fallback content
      setEmailContent({
        subject: `Special offer for ${lead.company}`,
        text: `Hello ${lead.name},\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
        html: `<p>Hello ${lead.name},</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateClick = () => {
    if (selectedLead) {
      generateEmailContent(selectedLead);
    }
  };

  const handleEditContent = (content: {
    subject?: string;
    text?: string;
    html?: string;
  }) => {
    setEmailContent(content);
  };

  const sendEmail = async () => {
    if (!selectedLead || !emailContent.subject) return;

    setSendingStatus({ isSending: true, success: 0, failed: 0 });
    try {
      const response = await axios.post("/api/send-email", {
        recipient: selectedLead.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      setSendingStatus({
        isSending: false,
        success: 1,
        failed: 0,
        message: `Email sent successfully to ${selectedLead.email}`,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSendingStatus({
        isSending: false,
        success: 0,
        failed: 1,
        message: `Failed to send email to ${selectedLead.email}`,
      });
    }
  };

  const sendBulkEmails = async () => {
    if (leads.length === 0 || !emailContent.subject) return;

    setSendingStatus({
      isSending: true,
      success: 0,
      failed: 0,
      message: "Preparing to send bulk emails...",
    });

    try {
      // Prepare email data for each lead
      const emailList = leads.map((lead) => {
        // Replace placeholders in template with actual values
        const personalizedSubject = emailContent.subject?.replace(
          /{{(\w+)}}/g,
          (_, key) => lead[key as keyof Lead] || ""
        );

        const personalizedText = emailContent.text?.replace(
          /{{(\w+)}}/g,
          (_, key) => lead[key as keyof Lead] || ""
        );

        const personalizedHtml = emailContent.html?.replace(
          /{{(\w+)}}/g,
          (_, key) => lead[key as keyof Lead] || ""
        );

        return {
          recipient: lead.email,
          subject: personalizedSubject,
          text: personalizedText,
          html: personalizedHtml,
        };
      });

      // Send the bulk emails
      const response = await axios.post("/api/send-bulk-emails", { emailList });

      setSendingStatus({
        isSending: false,
        success: response.data.successful || 0,
        failed: response.data.failed || 0,
        message: `Sent ${response.data.successful || 0} emails, ${
          response.data.failed || 0
        } failed`,
      });
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      setSendingStatus({
        isSending: false,
        success: 0,
        failed: leads.length,
        message: "Failed to send bulk emails. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Email Campaign Generator Section */}
      <section className="py-20 bg-dark-space relative">
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium mb-4">
              <span className="text-cyber-green">
                AI Email Campaign Generator
              </span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Upload your lead data and let our AI craft personalized emails for
              your campaign
            </p>
          </div>

          <div className="split-panel-grid mb-24">
            <div className="left-panel bg-dark-space border-2 border-dashed border-gray-700 apple-radius">
              <h3 className="text-xl font-medium mb-6 text-cyber-green">
                Lead Data
              </h3>
              <FileDropzone
                onFileProcess={handleFileProcessed}
                isGenerating={isGenerating}
              />
            </div>
            <div className="right-panel bg-dark-space border-2 border-dashed border-gray-700 apple-radius">
              <h3 className="text-xl font-medium mb-6 text-cyber-green flex justify-between items-center">
                <span>AI Email Generator</span>
                {emailContent.html && !isGenerating && (
                  <button
                    className="text-xs bg-dark-secondary text-cyber-green py-1.5 px-3 border apple-radius-sm hover:bg-dark-secondary/70 flex items-center gap-1.5 transition-colors"
                    onClick={() =>
                      window.open(
                        `data:text/html;charset=utf-8,${encodeURIComponent(
                          emailContent.html || ""
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
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Preview Email
                  </button>
                )}
              </h3>
              <div className="flex-1">
                <AIPreviewPanel
                  emailContent={
                    emailContent.html
                      ? {
                          subject: emailContent.subject || "",
                          content: emailContent.html || "",
                        }
                      : null
                  }
                  isGenerating={isGenerating}
                  onRegenerateClick={handleRegenerateClick}
                  onEditContent={(subject, content) =>
                    handleEditContent({
                      subject,
                      html: content,
                      text: content.replace(/<[^>]*>?/gm, ""),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Email Features FAQ */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="flex items-center mb-10">
              <div className="h-px flex-1 bg-gray-800"></div>
              <h3 className="text-lg font-medium mx-8 text-cyber-green">
                What's included
              </h3>
              <div className="h-px flex-1 bg-gray-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-dark-space border-2 border-gray-700 apple-radius-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyber-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Personalized Greeting
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Each email automatically includes the recipient's name and
                    company details
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-dark-space border-2 border-gray-700 apple-radius-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyber-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Company-Specific Content
                  </h4>
                  <p className="text-text-secondary text-sm">
                    AI generates relevant content based on the company profile
                    and domain
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-dark-space border-2 border-gray-700 apple-radius-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyber-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Compelling Call to Action
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Strong, clear CTA designed to maximize response rates
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-dark-space border-2 border-gray-700 apple-radius-sm flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyber-green"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">
                    Professional Formatting
                  </h4>
                  <p className="text-text-secondary text-sm">
                    Clean HTML structure that renders properly across all email
                    clients
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Stats */}
          <VisitorStats />
        </div>
      </section>

      {/* Testimonials Section with more spacing */}
      <Testimonials />
    </div>
  );
}
