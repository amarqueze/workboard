import { useNavigate } from "react-router-dom";

import { useModal } from "../../components/modal/useModal";
import NewAccountModal from "../../components/newaccountmodal/NewAccountModal";
import { useToast } from "../../components/toast/useToast";
import { useAccounts } from "../../hooks/use-accounts";
import { useAuth } from "../../hooks/use-auth";
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

  const { data, logout } = useAuth();

  const { showToast } = useToast();

  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isError: isAccountsError,
  } = useAccounts();


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
          message:
            "The account was created successfully.",
          type: "success",
        });
      },
    });
  }


  function handleOpenDashboard() {
    navigate(appRoutes.taskDashboard);
  }


  function handleLogout() {
    logout();

    navigate(appRoutes.login, {
      replace: true,
    });
  }


  return (
    <main className="home-page">
      <section className="home-shell">
        <header className="home-header">
          <div className="home-header__left">
            <div className="home-logo">
              WB
            </div>

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
              {data?.name?.charAt(0) ?? ""}
              {data?.last_name?.charAt(0) ?? ""}
            </div>

            <span className="home-user__name">
              {data?.name} {data?.last_name}
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
            Welcome to WorkBoard, {data?.name}!
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

          <section className="home-users">
            <h2 className="home-users__title">
              List of users
            </h2>

            {isLoadingAccounts && (
              <p className="home-users__status">
                Loading users...
              </p>
            )}

            {isAccountsError && (
              <p className="home-users__status">
                Unable to load users.
              </p>
            )}

            {!isLoadingAccounts &&
              !isAccountsError &&
              accounts && (
                <div className="home-users__table-wrapper">
                  <table className="home-users__table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {accounts.map((account) => (
                        <tr key={account.account_id}>
                          <td>
                            {account.name} {account.last_name}
                          </td>

                          <td>{account.email}</td>

                          <td>{account.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </section>
        </div>
      </section>
    </main>
  );
}


export default HomePage;