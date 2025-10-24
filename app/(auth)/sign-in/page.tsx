"use client";
import Footer from "@/components/forms/Footer";
import InputField from "@/components/forms/InputField";
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInWithEmail(data);
      if (result.success) {
        router.push("/");
      }
    } catch (error) {
      toast.error("signin error", {
        description:
          error instanceof Error ? error.message : "failed to sign in",
      });
    }
  };

  return (
    <>
      <h1 className="form-title">Welcome Back</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          placeholder="x7OgM@example.com"
          register={register}
          error={errors.email}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^\w+@\w+\.\w+$/,
              message: "Invalid email address",
            },
          }}
        />

        <InputField
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          register={register}
          error={errors.password}
          validation={{ required: "Password is required", minLength: 8 }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <Footer
          text="Don't have an account?"
          href="/sign-up"
          linkText="Sign Up"
        />
      </form>
    </>
  );
};

export default SignIn;
