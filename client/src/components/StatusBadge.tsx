/**
 * This component shows a lead status with a colored badge style.
 * It helps users quickly identify the pipeline stage of each lead.
 */

import { LeadStatus } from "../types/lead"; // Import LeadStatus so status prop only accepts allowed status values.

// This type describes props accepted by StatusBadge component.
interface StatusBadgeProps {
  // status is the current lead stage that we want to display.
  status: LeadStatus;
}

// This function returns a Tailwind class string based on status value.
function getStatusColorClass(status: LeadStatus): string {
  /**
   * Maps each status to specific badge background and text colors.
   *
   * Input:
   * - status: one of the allowed lead statuses.
   *
   * Returns:
   * - Tailwind CSS class string for that status.
   */

  // The color mapping below connects each status to a unique color.
  if (status === "New Lead") {
    return "bg-blue-100 text-blue-700";
  } else if (status === "Contacted") {
    return "bg-yellow-100 text-yellow-700";
  } else if (status === "Site Visit Scheduled") {
    return "bg-orange-100 text-orange-700";
  } else if (status === "Proposal Sent") {
    return "bg-purple-100 text-purple-700";
  } else if (status === "Won") {
    return "bg-green-100 text-green-700";
  } else {
    return "bg-red-100 text-red-700";
  }
}

// This component renders one span element with the correct color and status text.
function StatusBadge({ status }: StatusBadgeProps) {
  /**
   * Displays a colored status badge.
   *
   * Input:
   * - status prop from parent component.
   *
   * Returns:
   * - JSX span element with color classes.
   */

  // Get CSS classes for current status.
  const statusColorClass = getStatusColorClass(status);

  // Return the styled badge.
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColorClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge; // Export component so other files can use it.
