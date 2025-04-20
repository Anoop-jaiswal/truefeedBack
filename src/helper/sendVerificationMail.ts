import { resend } from "../lib/resendMail";
import VerificationEmail from "../../emails/VerificationEamil";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationMail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Email",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
      html: "<strong>It works!</strong>",
    });
    return {
      message: "Verification email sent successfully",
      success: true,
    };
  } catch (emailError) {
    console.log("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Error sending verification email",
      isAcceptingMessages: false,
    };
  }
}
