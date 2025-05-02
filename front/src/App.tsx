import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./components/layout/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import GamesReleasedAnalysis from "./pages/GamesReleasedAnalysis";
import ConsoleAnalysis from "./pages/ConsoleAnalysis";
import GenreAnalysis from "./pages/GenreAnalysis";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "games-released",
        element: <GamesReleasedAnalysis />,
      },
      {
        path: "console-analysis",
        element: <ConsoleAnalysis />,
      },
      {
        path: "genre-analysis",
        element: <GenreAnalysis />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
