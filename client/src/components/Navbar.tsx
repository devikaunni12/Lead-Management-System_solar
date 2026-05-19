/**
 * This component renders the top navigation bar of the app.
 * It gives users quick links to the main pages.
 */

import { Link } from "react-router-dom"; // Link lets us navigate without reloading the full page (unlike a normal <a> tag).

// This component renders the top nav with app title and page links.
function Navbar() {
  /**
   * Renders navigation links for dashboard, lead list, and add lead page.
   *
   * Input:
   * - No direct input.
   *
   * Returns:
   * - JSX for top navbar.
   */

  return (
    <nav className="w-full bg-emerald-700 text-white shadow-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold tracking-wide">☀️ Golden Ray — Lead Manager</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link className="rounded bg-emerald-600 px-3 py-1 hover:bg-emerald-500" to="/">
            Dashboard
          </Link>
          <Link className="rounded bg-emerald-600 px-3 py-1 hover:bg-emerald-500" to="/leads">
            All Leads
          </Link>
          <Link className="rounded bg-lime-500 px-3 py-1 text-emerald-900 hover:bg-lime-400" to="/leads/new">
            + Add Lead
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; // Export component for use in App.tsx.
