import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { NotificationProvider } from "./contexts/NotificationContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <RoleProvider>
            <App />
          </RoleProvider>
        </AuthProvider>
      </NotificationProvider>
      <ReactQueryDevtools initialIsOpen={true} buttonPosition="bottom-right" />
    </QueryClientProvider>
  </StrictMode>
);
