/**
 * This page shows all leads with filtering, editing, status update, and delete actions.
 * It acts as the main working screen for the sales team.
 */

import { useEffect } from "react"; // useEffect runs code when component mounts or dependency values change.
import { useState } from "react"; // useState stores data that can change over time.
import { useNavigate } from "react-router-dom"; // useNavigate lets us move to another page programmatically.

import { fetchAllLeads } from "../api/leadsApi"; // fetchAllLeads gets list data from backend.
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; // ConfirmDeleteModal asks user before delete.
import FilterBar from "../components/FilterBar"; // FilterBar renders status/location/date filters.
import LeadTable from "../components/LeadTable"; // LeadTable renders the leads table with action buttons.
import StatusUpdateModal from "../components/StatusUpdateModal"; // StatusUpdateModal lets user change pipeline status.
import { Lead } from "../types/lead"; // Lead type defines shape of each lead object.

// This component renders the all leads page.
function LeadsListPage() {
  /**
   * Loads and displays leads with filter and action controls.
   *
   * Input:
   * - No direct input.
   *
   * Returns:
   * - JSX for leads list page.
   */

  // leadList stores all leads shown in table.
  const [leadList, setLeadList] = useState<Lead[]>([]);

  // isLoading tracks whether list API call is currently running.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // errorMessage stores API error text if loading fails.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // statusFilter stores selected status value from dropdown.
  const [statusFilter, setStatusFilter] = useState<string>("");

  // locationFilter stores typed location text value.
  const [locationFilter, setLocationFilter] = useState<string>("");

  // fromDate stores start date filter value.
  const [fromDate, setFromDate] = useState<string>("");

  // toDate stores end date filter value.
  const [toDate, setToDate] = useState<string>("");

  // selectedLeadForStatusModal stores lead currently selected for status update.
  const [selectedLeadForStatusModal, setSelectedLeadForStatusModal] = useState<Lead | null>(null);

  // selectedLeadForDeleteModal stores lead currently selected for delete confirmation.
  const [selectedLeadForDeleteModal, setSelectedLeadForDeleteModal] = useState<Lead | null>(null);

  // navigate function helps us move to edit page.
  const navigate = useNavigate();

  // This function fetches leads from backend using current filters.
  async function loadLeadList() {
    /**
     * Calls backend API and updates lead list state.
     *
     * Input:
     * - No direct input. Uses current filter states.
     *
     * Returns:
     * - Promise<void>
     */

    // Show loading state and clear old error.
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Request filtered leads from API.
      const fetchedLeadList = await fetchAllLeads({
        status: statusFilter,
        location: locationFilter,
        from_date: fromDate,
        to_date: toDate,
      });

      // Save fetched leads into state.
      setLeadList(fetchedLeadList);
    } catch (error) {
      // Save readable error message.
      setErrorMessage("Could not load leads.");
    } finally {
      // Stop loading state in all cases.
      setIsLoading(false);
    }
  }

  // Load leads when page first mounts.
  useEffect(() => {
    loadLeadList();
  }, []);

  // Re-fetch leads whenever any filter value changes.
  useEffect(() => {
    loadLeadList();
  }, [statusFilter, locationFilter, fromDate, toDate]);

  // This function opens status update modal for a chosen lead.
  function openStatusModal(lead: Lead) {
    /**
     * Sets selected lead for status modal.
     *
     * Input:
     * - lead: selected lead row.
     *
     * Returns:
     * - No return value.
     */

    setSelectedLeadForStatusModal(lead);
  }

  // This function opens delete confirmation modal for a chosen lead.
  function openDeleteModal(lead: Lead) {
    /**
     * Sets selected lead for delete modal.
     *
     * Input:
     * - lead: selected lead row.
     *
     * Returns:
     * - No return value.
     */

    setSelectedLeadForDeleteModal(lead);
  }

  // This function navigates user to edit page for selected lead.
  function goToEditPage(leadId: number) {
    /**
     * Moves user to edit lead route.
     *
     * Input:
     * - leadId: selected lead ID.
     *
     * Returns:
     * - No return value.
     */

    navigate(`/leads/${leadId}/edit`);
  }

  // This function clears all filter values at once.
  function clearAllFilters() {
    /**
     * Resets status, location, and date filters back to empty values.
     *
     * Input:
     * - No direct input.
     *
     * Returns:
     * - No return value.
     */

    setStatusFilter("");
    setLocationFilter("");
    setFromDate("");
    setToDate("");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-emerald-800">All Leads</h1>

      <FilterBar
        fromDate={fromDate}
        locationFilter={locationFilter}
        onClearFilters={clearAllFilters}
        onFromDateChange={setFromDate}
        onLocationFilterChange={setLocationFilter}
        onStatusFilterChange={setStatusFilter}
        onToDateChange={setToDate}
        statusFilter={statusFilter}
        toDate={toDate}
      />

      {isLoading === true && <p className="text-sm text-emerald-700">Loading leads...</p>}
      {errorMessage !== "" && <p className="text-sm text-red-600">{errorMessage}</p>}

      {isLoading === false && errorMessage === "" && (
        <LeadTable
          leads={leadList}
          onDeleteClick={openDeleteModal}
          onEditClick={goToEditPage}
          onStatusClick={openStatusModal}
        />
      )}

      {selectedLeadForStatusModal !== null && (
        <StatusUpdateModal
          currentStatus={selectedLeadForStatusModal.status}
          leadId={selectedLeadForStatusModal.id}
          onClose={() => {
            setSelectedLeadForStatusModal(null);
          }}
          onStatusSaved={loadLeadList}
        />
      )}

      {selectedLeadForDeleteModal !== null && (
        <ConfirmDeleteModal
          leadId={selectedLeadForDeleteModal.id}
          onClose={() => {
            setSelectedLeadForDeleteModal(null);
          }}
          onDeleteComplete={loadLeadList}
        />
      )}
    </div>
  );
}

export default LeadsListPage; // Export page for route usage.
