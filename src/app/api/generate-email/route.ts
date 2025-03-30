import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.company) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, company" },
        { status: 400 }
      );
    }

    // Call our backend to generate content using AI
    const response = await fetch(
      "http://localhost:5500/api/generate-and-send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // We're only sending this to get the generated content, not to actually send emails
        body: JSON.stringify({
          clientData: [data],
          // Setting to a special value to indicate we're just generating, not sending
          disableSending: true,
        }),
      }
    );

    // If the backend is not available or returns an error, use fallback content
    if (!response.ok) {
      return NextResponse.json({
        subject: `Special offer for ${data.company}`,
        text: `Hello ${data.name},\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
        html: `<p>Hello ${data.name},</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
      });
    }

    const result = await response.json();

    // Extract the generated email content
    // If we're just using the backend to generate (not send), we should get the content back
    const emailContent = result.results?.generatedEmails?.[0] || {
      subject: `Special offer for ${data.company}`,
      text: `Hello ${data.name},\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
      html: `<p>Hello ${data.name},</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
    };

    return NextResponse.json(emailContent);
  } catch (error) {
    console.error("Error generating email:", error);

    // Return fallback content on error
    const data = await request.json().catch(() => ({}));
    return NextResponse.json({
      subject: `Special offer for ${data.company || "your company"}`,
      text: `Hello ${
        data.name || "there"
      },\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
      html: `<p>Hello ${
        data.name || "there"
      },</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
    });
  }
}
