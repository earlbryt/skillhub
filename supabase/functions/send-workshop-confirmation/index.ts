
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Use the RESEND_API_KEY from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  firstName: string;
  lastName: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  workshopLocation: string;
  workshopDescription: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log("Received email request:", data);

    // Format the date
    const date = new Date(data.workshopDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Log the API key (masked for security, just the length)
    const apiKey = Deno.env.get("RESEND_API_KEY");
    console.log(`Using Resend API key (length: ${apiKey?.length || 0})`);

    const { error } = await resend.emails.send({
      from: "Workshop Hub <onboarding@resend.dev>",
      to: [data.to],
      subject: `Your Registration: ${data.workshopTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Workshop Registration Confirmation</h1>
          <p>Hello ${data.firstName} ${data.lastName},</p>
          <p>Thank you for registering for the following workshop:</p>
          
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h2 style="color: #4F46E5; margin-top: 0;">${data.workshopTitle}</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${data.workshopTime}</p>
            <p><strong>Location:</strong> ${data.workshopLocation}</p>
            <p><strong>Description:</strong> ${data.workshopDescription}</p>
          </div>
          
          <p>We look forward to seeing you there!</p>
          <p>Best regards,<br>Workshop Hub Team</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>If you did not register for this workshop, please contact us immediately.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully");
    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-workshop-confirmation function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
