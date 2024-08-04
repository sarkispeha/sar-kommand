"use client";
import { createContext, useState, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";

interface ProvidersProps {
  children: React.ReactNode;
}

const AppContext = createContext({
  hello: "world",
});

const queryClient = new QueryClient();

export function AppWrapper({ children }: ProvidersProps) {
  let [state, setState] = useState({
    hello: "world",
  });

  return (
    <AppContext.Provider value={state}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextUIProvider>
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
