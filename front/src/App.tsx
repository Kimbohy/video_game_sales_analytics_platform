import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Dashboard } from "./components/layout/Dashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
