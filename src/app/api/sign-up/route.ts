import { sendVerificationMail } from "@/helper/sendVerificationMail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { email, username, password } = body;
    // Simulate sending a verification email
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Verification code:", verifyCode);

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists",
          },
          { status: 400 }
        );
      } else {
        const hassedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hassedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpires = new Date(
          Date.now() + 60 * 60 * 1000
        );
        existingUserByEmail.save();
      }
    } else {
      const hassedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(); // 1 day from now
      expiryDate.setDate(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hassedPassword,
        verifyCode,
        isVerified: false,
        verificationCode: null,
        verificationCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
    }

    // Simulate sending the email (replace with actual email sending logic)
    console.log(
      `Sending verification email to ${email} with code ${verifyCode}`
    );
    const emailResponse = await sendVerificationMail(
      email,
      verifyCode,
      username
    );

    if (!emailResponse) {
      return new Response(
        JSON.stringify({ message: "Failed to send verification email" }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
