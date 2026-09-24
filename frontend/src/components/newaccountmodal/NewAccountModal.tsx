import {
  type FormEvent,
  useState,
} from "react";

import "./NewAccountModal.css";

export type NewAccountModalValues = {
  email: string;
  password: string;
  name: string;
  last_name: string;
  role: string;
};

type NewAccountModalProps = {
  onClose: () => void;
  onCreate: (values: NewAccountModalValues) => void;
};

function NewAccountModal({
  onClose,
  onCreate,
}: NewAccountModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [passwordError, setPasswordError] =
    useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");

    onCreate({
      email,
      password,
      name,
      last_name: lastName,
      role,
    });
  }

  return (
    <form
      className="new-account-modal"
      onSubmit={handleSubmit}
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
          x
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
            className="input"
            type="email"
            value={email}
            required
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
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
              className="input"
              type="text"
              value={name}
              required
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
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
              className="input"
              type="text"
              value={lastName}
              required
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
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
            className="input"
            type="text"
            value={role}
            required
            onChange={(event) => {
              setRole(event.target.value);
            }}
          />
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
                passwordError === ""
                  ? "input"
                  : "input input--invalid"
              }
              type="password"
              value={password}
              required
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError("");
              }}
            />
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
                passwordError === ""
                  ? "input"
                  : "input input--invalid"
              }
              type="password"
              value={confirmPassword}
              required
              aria-describedby={
                passwordError === ""
                  ? undefined
                  : "new-account-password-error"
              }
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setPasswordError("");
              }}
            />
          </div>
        </div>

        {passwordError !== "" && (
          <p
            id="new-account-password-error"
            className="field__error"
          >
            {passwordError}
          </p>
        )}
      </div>

      <footer className="new-account-modal__footer">
        <button
          type="submit"
          className="button button--primary"
        >
          Create
        </button>
      </footer>
    </form>
  );
}

export default NewAccountModal;
