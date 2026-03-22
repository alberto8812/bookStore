import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";
import { PageError } from "../handkeErrors/PageError";

export const DashboardLayout = () => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo) => {
        return <PageError />;
      }}
    >
      <div
        className="w-screen h-screen"
        style={{ backgroundColor: "var(--color-white)" }}
      >
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};
