import "./LoginPage.css";

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
  return (
    <main className="login-page">
      <section className="login-shell">
        <header className="login-brand">
          <div className="login-brand__icon">
            <span>WB</span>
          </div>

          <h1 className="login-brand__title">WorkBoard</h1>

          <p className="login-brand__subtitle">
            Organize work. Deliver better.
          </p>
        </header>

        <form className="login-card">
          <div className="login-card__header">
            <h2>Sign in</h2>
            <p>Welcome back</p>
          </div>

          <div className="login-card__fields">
            <div className="textbox">
              <span className="textbox__icon">
                <MailIcon />
              </span>

              <input
                className="textbox__control"
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
              />
            </div>

            <div className="textbox">
              <span className="textbox__icon">
                <LockIcon />
              </span>

              <input
                className="textbox__control"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="button button--primary button--block"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;