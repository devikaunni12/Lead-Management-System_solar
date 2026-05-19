/**
 * This component renders all lead filter inputs in one row/card.
 * Parent page passes current filter values and setter callbacks as props.
 */

import { ChangeEvent } from "react"; // ChangeEvent gives a proper type for input and select change handlers.

// This type describes all props required by FilterBar.
interface FilterBarProps {
  // statusFilter is currently selected status filter value.
  statusFilter: string;
  // locationFilter is currently typed location filter text.
  locationFilter: string;
  // fromDate is currently selected start date string.
  fromDate: string;
  // toDate is currently selected end date string.
  toDate: string;
  // onStatusFilterChange updates status filter in parent state.
  onStatusFilterChange: (newValue: string) => void;
  // onLocationFilterChange updates location filter in parent state.
  onLocationFilterChange: (newValue: string) => void;
  // onFromDateChange updates from date in parent state.
  onFromDateChange: (newValue: string) => void;
  // onToDateChange updates to date in parent state.
  onToDateChange: (newValue: string) => void;
  // onClearFilters resets all filter fields in the parent page.
  onClearFilters: () => void;
}

// This function handles status dropdown changes.
function handleStatusChange(
  event: ChangeEvent<HTMLSelectElement>,
  onStatusFilterChange: (newValue: string) => void,
) {
  /**
   * Reads status select value and forwards it to parent callback.
   *
   * Input:
   * - event: select change event.
   * - onStatusFilterChange: parent callback.
   *
   * Returns:
   * - No return value.
   */

  const selectedStatus = event.target.value;
  onStatusFilterChange(selectedStatus);
}

// This function handles location input changes.
function handleLocationChange(
  event: ChangeEvent<HTMLInputElement>,
  onLocationFilterChange: (newValue: string) => void,
) {
  /**
   * Reads location input value and forwards it to parent callback.
   *
   * Input:
   * - event: input change event.
   * - onLocationFilterChange: parent callback.
   *
   * Returns:
   * - No return value.
   */

  const newLocationText = event.target.value;
  onLocationFilterChange(newLocationText);
}

// This function handles from-date input changes.
function handleFromDateChange(
  event: ChangeEvent<HTMLInputElement>,
  onFromDateChange: (newValue: string) => void,
) {
  /**
   * Reads from-date value and forwards it to parent callback.
   *
   * Input:
   * - event: date input change event.
   * - onFromDateChange: parent callback.
   *
   * Returns:
   * - No return value.
   */

  const newFromDateValue = event.target.value;
  onFromDateChange(newFromDateValue);
}

// This function handles to-date input changes.
function handleToDateChange(
  event: ChangeEvent<HTMLInputElement>,
  onToDateChange: (newValue: string) => void,
) {
  /**
   * Reads to-date value and forwards it to parent callback.
   *
   * Input:
   * - event: date input change event.
   * - onToDateChange: parent callback.
   *
   * Returns:
   * - No return value.
   */

  const newToDateValue = event.target.value;
  onToDateChange(newToDateValue);
}

// This component renders all filter inputs used by LeadsListPage.
function FilterBar({
  statusFilter,
  locationFilter,
  fromDate,
  toDate,
  onStatusFilterChange,
  onLocationFilterChange,
  onFromDateChange,
  onToDateChange,
  onClearFilters,
}: FilterBarProps) {
  /**
   * Renders the filter controls for lead list.
   *
   * Input:
   * - Filter values and update callbacks from parent page.
   *
   * Returns:
   * - JSX for filter card.
   */

  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-emerald-700">Filter Leads</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <select
          className="rounded border border-emerald-300 px-3 py-2 text-sm"
          onChange={(event) => {
            handleStatusChange(event, onStatusFilterChange);
          }}
          value={statusFilter}
        >
          <option value="">All Statuses</option>
          <option value="New Lead">New Lead</option>
          <option value="Contacted">Contacted</option>
          <option value="Site Visit Scheduled">Site Visit Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        <input
          className="rounded border border-emerald-300 px-3 py-2 text-sm"
          onChange={(event) => {
            handleLocationChange(event, onLocationFilterChange);
          }}
          placeholder="Search by location"
          type="text"
          value={locationFilter}
        />

        <input
          className="rounded border border-emerald-300 px-3 py-2 text-sm"
          onChange={(event) => {
            handleFromDateChange(event, onFromDateChange);
          }}
          type="date"
          value={fromDate}
        />

        <input
          className="rounded border border-emerald-300 px-3 py-2 text-sm"
          onChange={(event) => {
            handleToDateChange(event, onToDateChange);
          }}
          type="date"
          value={toDate}
        />
      </div>
      <div className="mt-3">
        <button
          className="rounded border border-emerald-400 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          onClick={onClearFilters}
          type="button"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar; // Export component for use in LeadsListPage.
