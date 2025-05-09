import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { generateEmailHtml } from "@/emails/contact-form";
import { runtime } from "../../../config";

export { runtime };

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "";

if (!SENDGRID_API_KEY || !FROM_EMAIL) {
  throw new Error("Missing required environment variables for SendGrid");
}

sgMail.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  try {
    console.log("Received contact form submission");
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      console.log("Missing required fields:", { name, email, message });
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Generate HTML content using the email template utility
    const emailHtml = generateEmailHtml({
      name,
      email,
      subject,
      message,
    });

    // Create email content
    const msg = {
      to: FROM_EMAIL,
      from: FROM_EMAIL, // Your verified sender email address
      subject: subject || `New Contact Form Message from ${name}`,
      html: emailHtml,
    };

    console.log("Attempting to send email to:", FROM_EMAIL);
    // Send email
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SendGrid API Error:", error.response.body);
    }
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}