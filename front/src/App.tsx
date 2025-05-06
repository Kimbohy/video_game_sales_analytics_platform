import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SalesAnalysis } from "./pages/SalesAnalysis";
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
        element: <SalesAnalysis />,
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
