import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useToast } from "../../components/toast/useToast";
import { useAuth } from "../../hooks/use-auth";
import { useLogin } from "../../hooks/use-login";
import { appRoutes } from "../../routes/appRoutes";

import "./LoginPage.css";


const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required."),
});

type LoginFormData = z.infer<typeof loginSchema>;


function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <path
        d="M4 6h16v12H4V6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="m4 7 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}


function LoginPage() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const {
    login,
    isLoading,
  } = useLogin();

  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        appRoutes.home,
        {
          replace: true,
        },
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);


  async function onSubmit(
    data: LoginFormData,
  ) {
    try {
      await login(data);

      navigate(
        appRoutes.home,
        {
          replace: true,
        },
      );
    } catch (error) {
      showToast({
        title: "Unable to sign in",
        message:
          error instanceof Error
            ? error.message
            : "Please try again.",
        type: "error",
        duration: 5000,
      });
    }
  }


  return (
    <main className="login-page">
      <section className="login-shell">
        <header className="login-brand">
          <div className="login-brand__icon">
            <span>WB</span>
          </div>

          <h1 className="login-brand__title">
            WorkBoard
          </h1>

          <p className="login-brand__subtitle">
            Organize work. Deliver better.
          </p>
        </header>

        <form
          className="login-card"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="login-card__header">
            <h2>Sign in</h2>
            <p>Welcome back</p>
          </div>

          <div className="login-card__fields">
            <div className="field">
              <div
                className={`textbox ${
                  errors.email
                    ? "textbox--invalid"
                    : ""
                }`}
              >
                <span className="textbox__icon">
                  <MailIcon />
                </span>

                <input
                  className="textbox__control"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <span className="field__error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="field">
              <div
                className={`textbox ${
                  errors.password
                    ? "textbox--invalid"
                    : ""
                }`}
              >
                <span className="textbox__icon">
                  <LockIcon />
                </span>

                <input
                  className="textbox__control"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  {...register("password")}
                />
              </div>

              {errors.password && (
                <span className="field__error">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="button button--primary button--block"
            disabled={isLoading}
          >
            {isLoading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}


export default LoginPage;