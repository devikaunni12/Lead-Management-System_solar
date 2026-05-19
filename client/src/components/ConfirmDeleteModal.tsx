/**
 * This component shows a confirmation popup before deleting a lead.
 * It helps prevent accidental deletes.
 */

import { useState } from "react"; // useState stores loading and error state while deleting.

import { deleteLeadById } from "../api/leadsApi"; // deleteLeadById sends DELETE request to backend.

// This type describes props accepted by ConfirmDeleteModal.
interface ConfirmDeleteModalProps {
  // leadId is the target lead ID that user wants to delete.
  leadId: number;
  // onClose closes the modal when user cancels or after success.
  onClose: () => void;
  // onDeleteComplete lets parent refresh list after successful delete.
  onDeleteComplete: () => void;
}

// This component renders a delete confirmation modal.
function ConfirmDeleteModal({ leadId, onClose, onDeleteComplete }: ConfirmDeleteModalProps) {
  /**
   * Displays a delete confirmation and performs delete on confirm.
   *
   * Input:
   * - leadId, onClose, onDeleteComplete props.
   *
   * Returns:
   * - JSX modal UI.
   */

  // isDeleting becomes true while request is in progress.
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // errorMessage stores a user-friendly error if delete fails.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // This function runs when user confirms delete.
  async function confirmDelete() {
    /**
     * Deletes the selected lead from backend.
     *
     * Input:
     * - No direct input. Uses leadId from props.
     *
     * Returns:
     * - Promise<void>
     */

    // Clear previous error before retry.
    setErrorMessage("");

    // Show deleting state.
    setIsDeleting(true);

    try {
      // Call API to delete the lead.
      await deleteLeadById(leadId);

      // Ask parent to refresh table.
      onDeleteComplete();

      // Close modal after success.
      onClose();
    } catch (error) {
      // Show readable error if delete fails.
      setErrorMessage("Could not delete lead. Please try again.");
    } finally {
      // Stop deleting state.
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
        <h2 className="mb-3 text-lg font-semibold text-red-700">Confirm Delete</h2>
        <p className="text-sm text-gray-700">
          Are you sure you want to delete this lead? This cannot be undone.
        </p>

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
            className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 disabled:bg-red-300"
            disabled={isDeleting}
            onClick={confirmDelete}
            type="button"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal; // Export modal for use in lead list page.
