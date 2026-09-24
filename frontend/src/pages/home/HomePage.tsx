import { useNavigate } from "react-router-dom";

import { useModal } from "../../components/modal/useModal";
import NewAccountModal from "../../components/newaccountmodal/NewAccountModal";
import { useToast } from "../../components/toast/useToast";
import { appRoutes } from "../../routes/appRoutes";
import "./HomePage.css";

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 5H5v14h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M9 12h9" />
    </svg>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const {
    closeModal,
    openModal,
    successModal,
  } = useModal();
  const { showToast } = useToast();

  function handleNewAccount() {
    openModal({
      width: "640px",
      height: "auto",
      content: (
        <NewAccountModal
          onClose={closeModal}
          onCreate={() => {
            successModal();
          }}
        />
      ),
      onSuccess: () => {
        showToast({
          title: "Account created",
          message: "The account was created successfully.",
          type: "success",
        });
      },
    });
  }

  function handleOpenDashboard() {
    navigate(appRoutes.taskDashboard);
  }

  function handleLogout() {
    navigate(appRoutes.login, {
      replace: true,
    });
  }

  return (
    <main className="home-page">
      <section className="home-shell">
        <header className="home-header">
          <div className="home-header__left">
            <div className="home-logo">WB</div>

            <button
              type="button"
              className="button"
              onClick={handleNewAccount}
            >
              + New Account
            </button>
          </div>

          <div className="home-user">
            <div className="home-user__avatar">
              RD
            </div>

            <span className="home-user__name">
              Rodrigo Diaz de Vivar
            </span>

            <button
              type="button"
              className="home-user__logout"
              aria-label="Sign out"
              onClick={handleLogout}
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        <div className="home-content">
          <h1 className="home-title">
            Welcome to WorkBoard
          </h1>

          <button
            type="button"
            className="home-dashboard-card"
            onClick={handleOpenDashboard}
          >
            <span className="home-dashboard-card__title">
              Dashboard
            </span>

            <span className="home-dashboard-card__description">
              Organize your tasks here
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
