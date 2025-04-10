
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with API key from environment variables
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for the request body
interface EmailRequestBody {
  to: string;
  firstName: string;
  lastName: string;
  workshopTitle: string;
  workshopDate: string;
  workshopTime: string;
  workshopLocation: string;
  workshopDescription: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: EmailRequestBody = await req.json();
    
    // Format date and time for better readability
    const date = new Date(body.workshopDate);
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    
    // Send email
    const { data, error } = await resend.emails.send({
      from: "Workshop Hub <workshops@resend.dev>",
      to: body.to,
      subject: `Registration Confirmed: ${body.workshopTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h1 style="color: #3b82f6; text-align: center;">Workshop Registration Confirmed</h1>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0;">Hello ${body.firstName} ${body.lastName},</p>
            <p>Thank you for registering for the following workshop:</p>
          </div>
          
          <div style="border-left: 4px solid #3b82f6; padding-left: 15px; margin-bottom: 20px;">
            <h2 style="color: #1e40af; margin-top: 0;">${body.workshopTitle}</h2>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${body.workshopTime}</p>
            <p><strong>Location:</strong> ${body.workshopLocation}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1e40af;">Workshop Description:</h3>
            <p>${body.workshopDescription}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0284c7; margin-top: 0;">What to Bring:</h3>
            <ul>
              <li>Notebook and pen/pencil</li>
              <li>Laptop (if applicable)</li>
              <li>Your questions and enthusiasm!</li>
            </ul>
          </div>
          
          <p style="text-align: center; color: #475569; font-size: 14px; margin-top: 30px;">
            If you have any questions, please contact us at <a href="mailto:support@workshophub.com" style="color: #3b82f6;">support@workshophub.com</a>
          </p>
          
          <p style="text-align: center; color: #64748b; font-size: 12px;">
            Workshop Hub - Empowering knowledge through hands-on learning
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Email sent successfully:", data);
    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-workshop-confirmation function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
