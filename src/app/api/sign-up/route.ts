import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Simulate sending a verification email
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Verification code:", verifyCode);

    // Simulate sending the email (replace with actual email sending logic)
    console.log(
      `Sending verification email to ${email} with code ${verifyCode}`
    );

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
