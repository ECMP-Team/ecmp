import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.recipient || !data.subject || (!data.text && !data.html)) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: recipient, subject, and either text or html",
        },
        { status: 400 }
      );
    }

    // Create the email object for the backend API
    const email = {
      recipient: data.recipient,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };

    // Send the individual email using our backend API
    const response = await fetch("http://localhost:5500/api/send-individual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: [email],
        fromEmail: data.fromEmail || "testing@resend.dev",
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${data.recipient}`,
      id: result.results?.details?.[0]?.id,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
