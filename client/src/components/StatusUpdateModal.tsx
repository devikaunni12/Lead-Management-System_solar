/**
 * This component shows a popup modal to change the status of one lead.
 * It receives needed values and callbacks from its parent page through props.
 */

import { useState } from "react"; // useState stores local state that changes when user selects a new status.

import { updateLeadStatus } from "../api/leadsApi"; // updateLeadStatus calls backend PATCH endpoint.
import { LeadStatus } from "../types/lead"; // LeadStatus type keeps status values valid.

// This type describes the props accepted by StatusUpdateModal.
interface StatusUpdateModalProps {
  // leadId is the ID of the lead we want to update.
  leadId: number;
  // currentStatus is the lead's current status before editing.
  currentStatus: LeadStatus;
  // onClose is a function parent gives us to close the modal.
  onClose: () => void;
  // onStatusSaved is a function parent gives us to refresh the list after save.
  onStatusSaved: () => void;
}

// This component renders a modal for status change.
function StatusUpdateModal({
  leadId,
  currentStatus,
  onClose,
  onStatusSaved,
}: StatusUpdateModalProps) {
  /**
   * Shows status dropdown and saves status changes.
   *
   * Input (props):
   * - leadId, currentStatus, onClose, onStatusSaved.
   * Props means values/functions sent from parent component to child component.
   *
   * Returns:
   * - JSX modal UI.
   */

  // selectedStatus stores user selection in dropdown.
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(currentStatus);

  // isSaving helps us disable buttons while API request is running.
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // errorMessage stores a readable error if status update fails.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // This function saves the newly selected status to backend.
  async function saveStatusUpdate() {
    /**
     * Sends status update request and handles success/error.
     *
     * Input:
     * - No direct input. Uses leadId and selectedStatus from state/props.
     *
     * Returns:
     * - Promise<void>
     */

    // Clear old error before trying again.
    setErrorMessage("");

    // Show saving state to user.
    setIsSaving(true);

    try {
      // Send API request to update status.
      await updateLeadStatus(leadId, selectedStatus);

      // Ask parent page to refresh list.
      onStatusSaved();

      // Close modal after successful save.
      onClose();
    } catch (error) {
      // Show simple error text if save fails.
      setErrorMessage("Could not update status. Please try again.");
    } finally {
      // Stop saving state in all cases.
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <h2 className="mb-3 text-lg font-semibold text-emerald-800">Update Lead Status</h2>

        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="statusSelect">
          Select New Status
        </label>

        <select
          className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
          id="statusSelect"
          onChange={(event) => {
            setSelectedStatus(event.target.value as LeadStatus);
          }}
          value={selectedStatus}
        >
          <option value="New Lead">New Lead</option>
          <option value="Contacted">Contacted</option>
          <option value="Site Visit Scheduled">Site Visit Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>

        {errorMessage !== "" && <p className="mt-2 text-sm text-red-600">{errorMessage}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 disabled:bg-emerald-300"
            disabled={isSaving}
            onClick={saveStatusUpdate}
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default StatusUpdateModal; // Export modal for use in LeadsListPage.
