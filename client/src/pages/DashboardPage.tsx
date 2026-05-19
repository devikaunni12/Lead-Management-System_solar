/**
 * This page shows dashboard analytics for the lead pipeline.
 * It loads summary numbers from backend and displays them in cards and tables.
 */

import { useEffect } from "react"; // useEffect runs side effects like API calls when component loads.
import { useState } from "react"; // useState stores data that can change.

import { fetchDashboardData } from "../api/leadsApi"; // fetchDashboardData gets summary metrics from backend.
import StatusBadge from "../components/StatusBadge"; // StatusBadge shows color-coded status labels.
import { DashboardData } from "../types/lead"; // DashboardData type defines dashboard response shape.
import { LeadStatus } from "../types/lead"; // LeadStatus type helps us build ordered status lists safely.

// This list stores status order for consistent card display.
const STATUS_ORDER: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Site Visit Scheduled",
  "Proposal Sent",
  "Won",
  "Lost",
];

// This function returns a card color based on status.
function getStatusCardClass(status: LeadStatus): string {
  /**
   * Maps status values to background and text classes.
   *
   * Input:
   * - status: one pipeline stage.
   *
   * Returns:
   * - Tailwind class string.
   */

  if (status === "New Lead") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  } else if (status === "Contacted") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  } else if (status === "Site Visit Scheduled") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  } else if (status === "Proposal Sent") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  } else if (status === "Won") {
    return "bg-green-50 text-green-700 border-green-200";
  } else {
    return "bg-red-50 text-red-700 border-red-200";
  }
}

// This component renders the dashboard page.
function DashboardPage() {
  /**
   * Loads dashboard data and renders analytics sections.
   *
   * Input:
   * - No direct input.
   *
   * Returns:
   * - JSX for dashboard page.
   */

  // dashboardData stores values returned by backend.
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // isLoading tracks whether data is still being fetched.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // errorMessage stores a readable error if API call fails.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // useEffect runs code when the component first appears on screen.
  useEffect(() => {
    // This inner async function fetches dashboard data from backend.
    async function loadDashboardData() {
      /**
       * Calls API and updates state for dashboard.
       *
       * Input:
       * - No direct input.
       *
       * Returns:
       * - Promise<void>
       */

      // Start loading state and clear old error.
      setIsLoading(true);
      setErrorMessage("");

      try {
        // Fetch data from API.
        const fetchedDashboardData = await fetchDashboardData();

        // Save fetched data in state.
        setDashboardData(fetchedDashboardData);
      } catch (error) {
        // Save user-friendly error message.
        setErrorMessage("Could not load dashboard data.");
      } finally {
        // Stop loading in both success and failure cases.
        setIsLoading(false);
      }
    }

    // Call the async loader function.
    loadDashboardData();
  }, []);

  // If currently loading, show loading message.
  if (isLoading === true) {
    return <p className="text-sm text-emerald-700">Loading dashboard data...</p>;
  }

  // If an error exists, show error message.
  if (errorMessage !== "") {
    return <p className="text-sm text-red-600">{errorMessage}</p>;
  }

  // If dashboardData is still null for any reason, show fallback.
  if (dashboardData === null) {
    return <p className="text-sm text-gray-600">No dashboard data available.</p>;
  }

  // Read useful values from data for cleaner JSX.
  const totalLeadsValue = dashboardData.total_leads;
  const wonLeadsValue = dashboardData.by_status["Won"];
  const lostLeadsValue = dashboardData.by_status["Lost"];
  const conversionRateValue = dashboardData.conversion_rate;
  const recentLeadList = dashboardData.recent_leads;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-emerald-800">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{totalLeadsValue}</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Won Leads</p>
          <p className="mt-1 text-2xl font-bold text-green-700">{wonLeadsValue}</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Lost Leads</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{lostLeadsValue}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Conversion Rate %</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{conversionRateValue}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-emerald-800">Pipeline Breakdown</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATUS_ORDER.map((statusLabel) => {
            const statusCount = dashboardData.by_status[statusLabel];
            const statusCardClass = getStatusCardClass(statusLabel);
            return (
              <div className={`rounded-lg border p-4 ${statusCardClass}`} key={statusLabel}>
                <p className="text-sm font-medium">{statusLabel}</p>
                <p className="mt-1 text-xl font-bold">{statusCount}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-emerald-800">Most Recent Leads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-800">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {recentLeadList.map((recentLead) => {
                return (
                  <tr className="border-t border-emerald-100" key={recentLead.id}>
                    <td className="px-3 py-2">{recentLead.full_name}</td>
                    <td className="px-3 py-2">{recentLead.location}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={recentLead.status} />
                    </td>
                    <td className="px-3 py-2">
                      {new Date(recentLead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage; // Export dashboard page for App routes.
