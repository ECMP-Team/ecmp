import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.emailList ||
      !Array.isArray(data.emailList) ||
      data.emailList.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid emailList. Must be a non-empty array." },
        { status: 400 }
      );
    }

    // Validate each email in the list
    const validationErrors: string[] = [];
    data.emailList.forEach((email: any, index: number) => {
      if (!email.recipient) {
        validationErrors.push(`Email at index ${index} is missing recipient`);
      }
      if (!email.subject) {
        validationErrors.push(`Email at index ${index} is missing subject`);
      }
      if (!email.text && !email.html) {
        validationErrors.push(
          `Email at index ${index} is missing both text and html content`
        );
      }
    });

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation errors", details: validationErrors },
        { status: 400 }
      );
    }

    // Send to our backend API for processing
    const response = await fetch("http://localhost:5500/api/send-individual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emails: data.emailList,
        fromEmail: data.fromEmail || "testing@resend.dev",
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message || "Failed to send bulk emails",
          details: result.errors,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      successful: result.results?.successful || 0,
      failed: result.results?.failed || 0,
      details: result.results?.details || [],
    });
  } catch (error) {
    console.error("Error sending bulk emails:", error);
    return NextResponse.json(
      { error: "Failed to send bulk emails" },
      { status: 500 }
    );
  }
}
