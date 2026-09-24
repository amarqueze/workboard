import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRegisterAccount } from "../../hooks/use-register-account";

import "./NewAccountModal.css";

const newAccountSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address."),

    name: z
      .string()
      .min(1, "Name is required."),

    last_name: z
      .string()
      .min(1, "Last name is required."),

    role: z
      .string()
      .min(1, "Role is required."),

    password: z
      .string()
      .min(
        8,
        "Password must contain at least 8 characters.",
      ),

    confirmPassword: z
      .string()
      .min(1, "Confirm your password."),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    },
  );

type NewAccountFormData =
  z.infer<typeof newAccountSchema>;

type NewAccountModalProps = {
  onClose: () => void;
  onCreate: () => void;
};

function NewAccountModal({
  onClose,
  onCreate,
}: NewAccountModalProps) {
  const {
    mutateAsync: registerAccount,
    isPending,
  } = useRegisterAccount();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<NewAccountFormData>({
    resolver: zodResolver(newAccountSchema),

    defaultValues: {
      email: "",
      name: "",
      last_name: "",
      role: "member",
      password: "",
      confirmPassword: "",
    },
  });


  async function onSubmit(
    data: NewAccountFormData,
  ) {
    await registerAccount({
      email: data.email,
      password: data.password,
      name: data.name,
      last_name: data.last_name,
      role: data.role,
    });

    onCreate();
  }


  return (
    <form
      className="new-account-modal"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <header className="new-account-modal__header">
        <h2 className="new-account-modal__title">
          New Account
        </h2>

        <button
          type="button"
          className="new-account-modal__close"
          aria-label="Close new account"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <div className="new-account-modal__body">
        <div className="field">
          <label
            className="field__label"
            htmlFor="new-account-email"
          >
            Email
          </label>

          <input
            id="new-account-email"
            className={
              errors.email
                ? "input input--invalid"
                : "input"
            }
            type="email"
            autoComplete="email"
            {...register("email")}
          />

          {errors.email && (
            <p className="field__error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="new-account-modal__field-grid">
          <div className="field">
            <label
              className="field__label"
              htmlFor="new-account-name"
            >
              Name
            </label>

            <input
              id="new-account-name"
              className={
                errors.name
                  ? "input input--invalid"
                  : "input"
              }
              type="text"
              {...register("name")}
            />

            {errors.name && (
              <p className="field__error">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="field">
            <label
              className="field__label"
              htmlFor="new-account-last-name"
            >
              Last name
            </label>

            <input
              id="new-account-last-name"
              className={
                errors.last_name
                  ? "input input--invalid"
                  : "input"
              }
              type="text"
              {...register("last_name")}
            />

            {errors.last_name && (
              <p className="field__error">
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        <div className="field">
          <label
            className="field__label"
            htmlFor="new-account-role"
          >
            Role
          </label>

          <input
            id="new-account-role"
            className={
              errors.role
                ? "input input--invalid"
                : "input"
            }
            type="text"
            {...register("role")}
          />

          {errors.role && (
            <p className="field__error">
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="new-account-modal__field-grid">
          <div className="field">
            <label
              className="field__label"
              htmlFor="new-account-password"
            >
              Password
            </label>

            <input
              id="new-account-password"
              className={
                errors.password
                  ? "input input--invalid"
                  : "input"
              }
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />

            {errors.password && (
              <p className="field__error">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="field">
            <label
              className="field__label"
              htmlFor="new-account-confirm-password"
            >
              Confirm password
            </label>

            <input
              id="new-account-confirm-password"
              className={
                errors.confirmPassword
                  ? "input input--invalid"
                  : "input"
              }
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />

            {errors.confirmPassword && (
              <p className="field__error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="new-account-modal__footer">
        <button
          type="button"
          className="button"
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="button button--primary"
          disabled={isPending}
        >
          {isPending
            ? "Creating..."
            : "Create"}
        </button>
      </footer>
    </form>
  );
}

export default NewAccountModal;