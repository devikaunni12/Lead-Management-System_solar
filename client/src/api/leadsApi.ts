/**
 * This file contains all functions that talk to the backend API.
 * We keep all API calls in one place so they are easy to find and change.
 */

import { DashboardData } from "../types/lead"; // Import DashboardData so dashboard function can return typed data.
import { Lead } from "../types/lead"; // Import Lead type for functions that return lead objects.
import { LeadFormData } from "../types/lead"; // Import LeadFormData type for create and update requests.

// BASE_URL is the starting address of our backend server.
const BASE_URL = "http://localhost:8000/api";

// This helper function checks API responses and throws readable errors.
function checkApiResponse(response: Response) {
  /**
   * Checks whether fetch response is successful.
   *
   * Input:
   * - response: Response object returned by fetch.
   *
   * Returns:
   * - Nothing if response is OK.
   * - Throws an error if response is not OK.
   */

  // If backend sent a non-success HTTP code, throw an error.
  if (response.ok === false) {
    throw new Error("API request failed");
  }
}

// Fetches all leads, with optional filters.
export async function fetchAllLeads(filters?: {
  status?: string;
  location?: string;
  from_date?: string;
  to_date?: string;
}): Promise<Lead[]> {
  /**
   * Gets all leads from backend and applies optional filters.
   *
   * Input:
   * - filters: optional filter object.
   *
   * Returns:
   * - A promise that resolves to an array of Lead objects.
   */

  // Create URLSearchParams so we can safely build query string.
  const queryParameterBuilder = new URLSearchParams();

  // Add status filter only if it exists and is not empty.
  if (filters?.status !== undefined && filters.status !== "") {
    queryParameterBuilder.append("status", filters.status);
  }

  // Add location filter only if it exists and is not empty.
  if (filters?.location !== undefined && filters.location !== "") {
    queryParameterBuilder.append("location", filters.location);
  }

  // Add from_date filter only if it exists and is not empty.
  if (filters?.from_date !== undefined && filters.from_date !== "") {
    queryParameterBuilder.append("from_date", filters.from_date);
  }

  // Add to_date filter only if it exists and is not empty.
  if (filters?.to_date !== undefined && filters.to_date !== "") {
    queryParameterBuilder.append("to_date", filters.to_date);
  }

  // Start with base leads endpoint URL.
  let requestUrl = `${BASE_URL}/leads`;

  // Convert query params to string.
  const queryString = queryParameterBuilder.toString();

  // If query string has content, attach it after ?.
  if (queryString !== "") {
    requestUrl = `${requestUrl}?${queryString}`;
  }

  // Call backend endpoint.
  const response = await fetch(requestUrl);

  // Validate response status.
  checkApiResponse(response);

  // Parse and return JSON response.
  const leadList: Lead[] = await response.json();
  return leadList;
}

// Fetches a single lead by its ID.
export async function fetchLeadById(leadId: number): Promise<Lead> {
  /**
   * Gets one lead from backend using ID.
   *
   * Input:
   * - leadId: numeric lead ID.
   *
   * Returns:
   * - A promise that resolves to one Lead object.
   */

  // Build endpoint URL with ID.
  const requestUrl = `${BASE_URL}/leads/${leadId}`;

  // Send GET request.
  const response = await fetch(requestUrl);

  // Validate response status.
  checkApiResponse(response);

  // Parse and return lead object.
  const leadData: Lead = await response.json();
  return leadData;
}

// Sends a POST request to create a new lead.
export async function createNewLead(leadData: LeadFormData): Promise<Lead> {
  /**
   * Creates a new lead row in backend.
   *
   * Input:
   * - leadData: full lead form data.
   *
   * Returns:
   * - A promise that resolves to created Lead object.
   */

  // Build endpoint URL.
  const requestUrl = `${BASE_URL}/leads`;

  // Send POST request with JSON body.
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  // Validate response status.
  checkApiResponse(response);

  // Parse and return created lead.
  const createdLead: Lead = await response.json();
  return createdLead;
}

// Sends a PUT request to update all fields of a lead.
export async function updateLead(leadId: number, leadData: LeadFormData): Promise<Lead> {
  /**
   * Updates a lead by ID with full form data.
   *
   * Input:
   * - leadId: target lead ID.
   * - leadData: updated lead form data.
   *
   * Returns:
   * - A promise that resolves to updated Lead object.
   */

  // Build endpoint URL with lead ID.
  const requestUrl = `${BASE_URL}/leads/${leadId}`;

  // Send PUT request with JSON data.
  const response = await fetch(requestUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leadData),
  });

  // Validate response status.
  checkApiResponse(response);

  // Parse and return updated lead.
  const updatedLead: Lead = await response.json();
  return updatedLead;
}

// Sends a PATCH request to update only the status of a lead.
export async function updateLeadStatus(leadId: number, newStatus: string): Promise<Lead> {
  /**
   * Updates only status field of one lead.
   *
   * Input:
   * - leadId: target lead ID.
   * - newStatus: new status string.
   *
   * Returns:
   * - A promise that resolves to updated Lead object.
   */

  // Build status-specific endpoint URL.
  const requestUrl = `${BASE_URL}/leads/${leadId}/status`;

  // Send PATCH request with status payload.
  const response = await fetch(requestUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  // Validate response status.
  checkApiResponse(response);

  // Parse and return updated lead.
  const updatedLead: Lead = await response.json();
  return updatedLead;
}

// Sends a DELETE request to remove a lead.
export async function deleteLead(leadId: number): Promise<void> {
  /**
   * Deletes one lead from backend.
   *
   * Input:
   * - leadId: target lead ID.
   *
   * Returns:
   * - A promise that resolves when delete is complete.
   */

  // Build endpoint URL with ID.
  const requestUrl = `${BASE_URL}/leads/${leadId}`;

  // Send DELETE request.
  const response = await fetch(requestUrl, {
    method: "DELETE",
  });

  // Validate response status.
  checkApiResponse(response);
}

// This alias keeps a very explicit beginner-friendly name for delete calls.
export const deleteLeadById = deleteLead;

// Fetches dashboard analytics data.
export async function fetchDashboardData(): Promise<DashboardData> {
  /**
   * Fetches dashboard summary numbers and recent leads.
   *
   * Input:
   * - No input arguments.
   *
   * Returns:
   * - A promise that resolves to DashboardData object.
   */

  // Build dashboard endpoint URL.
  const requestUrl = `${BASE_URL}/dashboard`;

  // Send GET request.
  const response = await fetch(requestUrl);

  // Validate response status.
  checkApiResponse(response);

  // Parse and return dashboard data.
  const dashboardData: DashboardData = await response.json();
  return dashboardData;
}
