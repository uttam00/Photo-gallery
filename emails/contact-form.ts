export function generateEmailHtml({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Contact Form Submission</title>
        <style>
        /* Base styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: linear-gradient(135deg, #f6f8fd 0%, #f1f4f9 100%);
            margin: 0;
            padding: 0;
        }

        /* Container */
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 0;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        /* Header */
        .header {
            text-align: center;
            padding: 40px 20px;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            height: 40px;
            background: linear-gradient(135deg, #4f46e5 0%, transparent 100%);
            transform: skewY(-3deg);
        }

        .header h1 {
            color: white;
            font-size: 28px;
            margin: 0;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        /* Content */
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }

        .message {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            border-left: 4px solid #3b82f6;
        }

        .message p {
            margin: 0;
            color: #1e40af;
            font-size: 16px;
            font-weight: 500;
        }

        /* Details section */
        .details {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .detail-item {
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            background: #f8fafc;
            transition: all 0.3s ease;
        }

        .detail-item:hover {
            background: #f1f5f9;
            transform: translateX(5px);
        }

        .detail-item:last-child {
            margin-bottom: 0;
        }

        .label {
            font-weight: 600;
            color: #4f46e5;
            margin-bottom: 8px;
            display: block;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .value {
            color: #1e293b;
            font-size: 16px;
            line-height: 1.5;
        }

        /* Footer */
        .footer {
            text-align: center;
            padding: 30px 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            color: #64748b;
            font-size: 14px;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            margin: 5px 0;
        }

        .footer p:last-child {
            color: #94a3b8;
            font-size: 13px;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 12px;
            }

            .content {
                padding: 25px 20px;
            }

            .header {
                padding: 30px 15px;
            }

            .header h1 {
                font-size: 24px;
            }
        }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✨ New Message Received ✨</h1>
            </div>

            <div class="content">
                <div class="message">
                    <p>
                        🎉 You've received a new message from your portfolio website's
                        contact form. Here are the details:
                    </p>
                </div>

                <div class="details">
                    <div class="detail-item">
                        <span class="label">👤 Name</span>
                        <span class="value">${name}</span>
                    </div>

                    <div class="detail-item">
                        <span class="label">📧 Email</span>
                        <span class="value">${email}</span>
                    </div>

                    <div class="detail-item">
                        <span class="label">📝 Subject</span>
                        <span class="value">${
                          subject || "No subject provided"
                        }</span>
                    </div>

                    <div class="detail-item">
                        <span class="label">💌 Message</span>
                        <span class="value">${message.replace(
                          /\n/g,
                          "<br>"
                        )}</span>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>This email was sent from your portfolio website's contact form.</p>
                <p>© ${currentYear} Your Portfolio. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
