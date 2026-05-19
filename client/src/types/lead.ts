/**
 * This file defines all TypeScript types used by the lead management app.
 * These types help beginners understand exactly what each lead object contains.
 */

// The allowed values for property type.
export type PropertyType = "Residential" | "Commercial" | "Industrial";

// The allowed values for lead source.
export type LeadSource = "Website" | "Referral" | "Walk-in" | "Social Media";

// The allowed pipeline stages in order.
export type LeadStatus =
  | "New Lead"
  | "Contacted"
  | "Site Visit Scheduled"
  | "Proposal Sent"
  | "Won"
  | "Lost";

// The full shape of a lead object returned from the backend.
export interface Lead {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  location: string;
  property_type: PropertyType;
  system_size_kw: number;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

// The shape of data we send when creating or updating a lead.
// This does not include id or timestamps because backend creates those.
export interface LeadFormData {
  full_name: string;
  phone: string;
  email: string;
  location: string;
  property_type: PropertyType;
  system_size_kw: number;
  source: LeadSource;
  status: LeadStatus;
}

// This type describes dashboard data returned from /api/dashboard.
export interface DashboardData {
  total_leads: number;
  by_status: Record<LeadStatus, number>;
  conversion_rate: number;
  recent_leads: Lead[];
}
