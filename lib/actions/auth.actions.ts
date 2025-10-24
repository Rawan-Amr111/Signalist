"use server";

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    const response = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.fullName,
      },
    });
    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email: data.email,
          name: data.fullName,
          country: data.country,
          investmentGoals: data.investmentGoals,
          riskTolerance: data.riskTolerance,
          preferredIndustry: data.preferredIndustry,
        },
      });
    }
    return { success: true, data: response };
  } catch (error) {
    // !!! ده أهم جزء !!!
    // اتأكد إنك بترجع رسالة الإيرور الحقيقية

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message; // ده هيجيب رسالة Nodemailer الحقيقية
    }

    return { success: false, error: errorMessage };
  }
};
export const signInWithEmail = async (data: SignInFormData) => {
  try {
    const response = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    console.log("signin error", error);

    return { success: false, error: "signin error" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Something went wrong" };
  }
};
