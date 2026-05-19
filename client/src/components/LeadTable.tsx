/**
 * This component displays all leads in a table layout.
 * Parent component passes lead data and action callbacks as props.
 */

import StatusBadge from "./StatusBadge"; // StatusBadge shows a color-coded lead status tag.
import { Lead } from "../types/lead"; // Lead type defines the data shape of each table row.

// This type describes props needed by LeadTable.
interface LeadTableProps {
  // leads is the list of all lead objects to display.
  leads: Lead[];
  // onEditClick is called when user clicks Edit button.
  onEditClick: (leadId: number) => void;
  // onStatusClick is called when user clicks Update Status button.
  onStatusClick: (lead: Lead) => void;
  // onDeleteClick is called when user clicks Delete button.
  onDeleteClick: (lead: Lead) => void;
}

// This component renders the full leads table.
function LeadTable({ leads, onEditClick, onStatusClick, onDeleteClick }: LeadTableProps) {
  /**
   * Renders a responsive table with lead information and action buttons.
   *
   * Input:
   * - leads list and action handlers from parent component.
   *
   * Returns:
   * - JSX table.
   */

  return (
    <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-emerald-50 text-emerald-800">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Phone</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Location</th>
            <th className="px-3 py-2">Property</th>
            <th className="px-3 py-2">Size (kW)</th>
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Created</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((leadItem) => {
            return (
              <tr className="border-t border-emerald-100" key={leadItem.id}>
                <td className="px-3 py-2">{leadItem.full_name}</td>
                <td className="px-3 py-2">{leadItem.phone}</td>
                <td className="px-3 py-2">{leadItem.email}</td>
                <td className="px-3 py-2">{leadItem.location}</td>
                <td className="px-3 py-2">{leadItem.property_type}</td>
                <td className="px-3 py-2">{leadItem.system_size_kw}</td>
                <td className="px-3 py-2">{leadItem.source}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={leadItem.status} />
                </td>
                <td className="px-3 py-2">
                  {new Date(leadItem.created_at).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded bg-sky-600 px-2 py-1 text-xs text-white hover:bg-sky-500"
                      onClick={() => {
                        onEditClick(leadItem.id);
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-400"
                      onClick={() => {
                        onStatusClick(leadItem);
                      }}
                      type="button"
                    >
                      Update Status
                    </button>
                    <button
                      className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-500"
                      onClick={() => {
                        onDeleteClick(leadItem);
                      }}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable; // Export component for use in LeadsListPage.
