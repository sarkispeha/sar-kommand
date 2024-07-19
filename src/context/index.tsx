"use client";
import { createContext, useState, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppContext = createContext({
  hello: "world",
});

const queryClient = new QueryClient();

export function AppWrapper({ children }: { children: React.ReactNode }) {
  let [state, setState] = useState({
    hello: "world",
  });

  return (
    <AppContext.Provider value={state}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
