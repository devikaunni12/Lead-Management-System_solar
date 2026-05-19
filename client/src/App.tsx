/**
 * This is the main App component that sets up all the page routes.
 * It renders the navbar and selects which page to show based on URL path.
 */

import { BrowserRouter } from "react-router-dom"; // BrowserRouter enables navigation between pages without reloading.
import { Route } from "react-router-dom"; // Route maps one URL path to one component.
import { Routes } from "react-router-dom"; // Routes groups all Route items together.

import Navbar from "./components/Navbar"; // Navbar is the top navigation bar shown on every page.
import AddLeadPage from "./pages/AddLeadPage"; // AddLeadPage is the form to create a new lead.
import DashboardPage from "./pages/DashboardPage"; // DashboardPage shows analytics overview.
import EditLeadPage from "./pages/EditLeadPage"; // EditLeadPage allows editing an existing lead.
import LeadsListPage from "./pages/LeadsListPage"; // LeadsListPage shows all leads and filters.

// This component defines app layout and routes.
function App() {
  /**
   * Renders full app structure with router and page routes.
   *
   * Input:
   * - No direct input.
   *
   * Returns:
   * - JSX for entire app.
   */

  return (
    <BrowserRouter>
      <Navbar />
      <div className="mx-auto max-w-6xl p-4">
        <Routes>
          <Route element={<DashboardPage />} path="/" />
          <Route element={<LeadsListPage />} path="/leads" />
          <Route element={<AddLeadPage />} path="/leads/new" />
          <Route element={<EditLeadPage />} path="/leads/:id/edit" />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App; // Export App component for rendering in main.tsx.
