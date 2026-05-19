/**
 * This page lets users edit an existing lead.
 * It first fetches current lead values and pre-fills the form fields.
 */

import { useEffect } from "react"; // useEffect runs fetch logic when page loads.
import { FormEvent } from "react"; // FormEvent type is used for form submit event typing.
import { useState } from "react"; // useState stores form values and error states.
import { useNavigate } from "react-router-dom"; // useNavigate redirects after successful update.
import { useParams } from "react-router-dom"; // useParams reads lead ID from URL.

import { fetchLeadById } from "../api/leadsApi"; // fetchLeadById loads existing lead details.
import { updateLead } from "../api/leadsApi"; // updateLead sends PUT request with edited lead data.
import { LeadFormData } from "../types/lead"; // LeadFormData type defines payload shape.

// This component renders the edit lead form page.
function EditLeadPage() {
  /**
   * Fetches selected lead, lets user edit fields, validates input, and saves changes.
   *
   * Input:
   * - No direct input, but uses route parameter ID.
   *
   * Returns:
   * - JSX for edit lead page.
   */

  // idFromRoute is lead ID string from URL params.
  const { id: idFromRoute } = useParams<{ id: string }>();

  // fullName stores the name input value.
  const [fullName, setFullName] = useState<string>("");
  // phone stores the phone input value.
  const [phone, setPhone] = useState<string>("");
  // email stores the email input value.
  const [email, setEmail] = useState<string>("");
  // location stores the location input value.
  const [location, setLocation] = useState<string>("");
  // propertyType stores selected property type value.
  const [propertyType, setPropertyType] = useState<string>("Residential");
  // systemSizeKw stores numeric input as text.
  const [systemSizeKw, setSystemSizeKw] = useState<string>("");
  // source stores selected lead source.
  const [source, setSource] = useState<string>("Website");
  // status stores selected lead status.
  const [status, setStatus] = useState<string>("New Lead");

  // fullNameError stores validation error for full name.
  const [fullNameError, setFullNameError] = useState<string>("");
  // phoneError stores validation error for phone.
  const [phoneError, setPhoneError] = useState<string>("");
  // emailError stores validation error for email.
  const [emailError, setEmailError] = useState<string>("");
  // locationError stores validation error for location.
  const [locationError, setLocationError] = useState<string>("");
  // systemSizeKwError stores validation error for system size.
  const [systemSizeKwError, setSystemSizeKwError] = useState<string>("");

  // isLoading indicates whether existing lead data is still loading.
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // isSubmitting disables button while update request is running.
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // errorMessage shows page-level fetch or submit errors.
  const [errorMessage, setErrorMessage] = useState<string>("");

  // navigate redirects user to list page after successful update.
  const navigate = useNavigate();

  // This function checks full name field.
  function validateFullName(value: string): string {
    /**
     * Validates full name is not empty.
     *
     * Input:
     * - value: full name text.
     *
     * Returns:
     * - Error message if invalid, else empty string.
     */

    if (value.trim() === "") {
      return "Full name is required.";
    } else {
      return "";
    }
  }

  // This function checks phone field format.
  function validatePhone(value: string): string {
    /**
     * Validates phone against exactly 10 digits.
     *
     * Input:
     * - value: phone text.
     *
     * Returns:
     * - Error message if invalid, else empty string.
     */

    const phonePattern = /^\d{10}$/;
    if (phonePattern.test(value) === false) {
      return "Phone number must be exactly 10 digits.";
    } else {
      return "";
    }
  }

  // This function checks email basic format.
  function validateEmail(value: string): string {
    /**
     * Validates email contains @ and .
     *
     * Input:
     * - value: email text.
     *
     * Returns:
     * - Error message if invalid, else empty string.
     */

    const hasAtSymbol = value.includes("@");
    const hasDotSymbol = value.includes(".");
    if (hasAtSymbol === false || hasDotSymbol === false) {
      return "Email must contain @ and .";
    } else {
      return "";
    }
  }

  // This function checks location field.
  function validateLocation(value: string): string {
    /**
     * Validates location is not empty.
     *
     * Input:
     * - value: location text.
     *
     * Returns:
     * - Error message if invalid, else empty string.
     */

    if (value.trim() === "") {
      return "Location is required.";
    } else {
      return "";
    }
  }

  // This function checks system size range.
  function validateSystemSize(value: string): string {
    /**
     * Validates system size is a number between 1 and 100.
     *
     * Input:
     * - value: system size text.
     *
     * Returns:
     * - Error message if invalid, else empty string.
     */

    const parsedSize = Number(value);
    const isNotNumber = Number.isNaN(parsedSize);

    if (value.trim() === "") {
      return "System size is required.";
    } else if (isNotNumber === true) {
      return "System size must be a valid number.";
    } else if (parsedSize < 1 || parsedSize > 100) {
      return "System size must be between 1 and 100.";
    } else {
      return "";
    }
  }

  // This function validates all form fields.
  function validateForm(): boolean {
    /**
     * Runs all field validators and stores errors in state.
     *
     * Input:
     * - No direct input. Uses form state values.
     *
     * Returns:
     * - true when all values are valid, false otherwise.
     */

    const fullNameValidationError = validateFullName(fullName);
    const phoneValidationError = validatePhone(phone);
    const emailValidationError = validateEmail(email);
    const locationValidationError = validateLocation(location);
    const systemSizeValidationError = validateSystemSize(systemSizeKw);

    setFullNameError(fullNameValidationError);
    setPhoneError(phoneValidationError);
    setEmailError(emailValidationError);
    setLocationError(locationValidationError);
    setSystemSizeKwError(systemSizeValidationError);

    const formIsValid =
      fullNameValidationError === "" &&
      phoneValidationError === "" &&
      emailValidationError === "" &&
      locationValidationError === "" &&
      systemSizeValidationError === "";

    return formIsValid;
  }

  // Load existing lead data when page first renders.
  useEffect(() => {
    // This async function fetches lead details and fills form fields.
    async function loadExistingLead() {
      /**
       * Fetches one lead by ID and pre-fills form fields.
       *
       * Input:
       * - No direct input. Uses route ID.
       *
       * Returns:
       * - Promise<void>
       */

      if (idFromRoute === undefined) {
        setErrorMessage("Lead ID is missing in URL.");
        setIsLoading(false);
        return;
      }

      const parsedLeadId = Number(idFromRoute);
      if (Number.isNaN(parsedLeadId) === true) {
        setErrorMessage("Lead ID is invalid.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const existingLead = await fetchLeadById(parsedLeadId);

        setFullName(existingLead.full_name);
        setPhone(existingLead.phone);
        setEmail(existingLead.email);
        setLocation(existingLead.location);
        setPropertyType(existingLead.property_type);
        setSystemSizeKw(String(existingLead.system_size_kw));
        setSource(existingLead.source);
        setStatus(existingLead.status);
      } catch (error) {
        setErrorMessage("Could not load lead details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadExistingLead();
  }, [idFromRoute]);

  // This function handles update submit action.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    /**
     * Prevents default submit, validates form, updates lead, and redirects on success.
     *
     * Input:
     * - event: submit event.
     *
     * Returns:
     * - Promise<void>
     */

    event.preventDefault();
    setErrorMessage("");

    if (idFromRoute === undefined) {
      setErrorMessage("Lead ID is missing in URL.");
      return;
    }

    const parsedLeadId = Number(idFromRoute);
    if (Number.isNaN(parsedLeadId) === true) {
      setErrorMessage("Lead ID is invalid.");
      return;
    }

    const formIsValid = validateForm();
    if (formIsValid === false) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedLeadData: LeadFormData = {
        full_name: fullName,
        phone: phone,
        email: email,
        location: location,
        property_type: propertyType as LeadFormData["property_type"],
        system_size_kw: Number(systemSizeKw),
        source: source as LeadFormData["source"],
        status: status as LeadFormData["status"],
      };

      await updateLead(parsedLeadId, updatedLeadData);
      navigate("/leads");
    } catch (error) {
      setErrorMessage("Could not update lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // anyErrorExists helps us disable submit button if any validation error exists.
  const anyErrorExists =
    fullNameError !== "" ||
    phoneError !== "" ||
    emailError !== "" ||
    locationError !== "" ||
    systemSizeKwError !== "";

  if (isLoading === true) {
    return <p className="text-sm text-emerald-700">Loading lead details...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-emerald-800">Edit Lead</h1>

      {errorMessage !== "" && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="fullName"
            onChange={(event) => {
              const newValue = event.target.value;
              setFullName(newValue);
              setFullNameError(validateFullName(newValue));
            }}
            type="text"
            value={fullName}
          />
          {fullNameError !== "" && <p className="mt-1 text-xs text-red-600">{fullNameError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="phone">
            Phone
          </label>
          <input
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="phone"
            onChange={(event) => {
              const newValue = event.target.value;
              setPhone(newValue);
              setPhoneError(validatePhone(newValue));
            }}
            type="text"
            value={phone}
          />
          {phoneError !== "" && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="email"
            onChange={(event) => {
              const newValue = event.target.value;
              setEmail(newValue);
              setEmailError(validateEmail(newValue));
            }}
            type="email"
            value={email}
          />
          {emailError !== "" && <p className="mt-1 text-xs text-red-600">{emailError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="location">
            Location
          </label>
          <input
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="location"
            onChange={(event) => {
              const newValue = event.target.value;
              setLocation(newValue);
              setLocationError(validateLocation(newValue));
            }}
            type="text"
            value={location}
          />
          {locationError !== "" && <p className="mt-1 text-xs text-red-600">{locationError}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="propertyType">
            Property Type
          </label>
          <select
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="propertyType"
            onChange={(event) => {
              setPropertyType(event.target.value);
            }}
            value={propertyType}
          >
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="systemSize">
            System Size (kW)
          </label>
          <input
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="systemSize"
            onChange={(event) => {
              const newValue = event.target.value;
              setSystemSizeKw(newValue);
              setSystemSizeKwError(validateSystemSize(newValue));
            }}
            type="number"
            value={systemSizeKw}
          />
          {systemSizeKwError !== "" && (
            <p className="mt-1 text-xs text-red-600">{systemSizeKwError}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="source">
            Source
          </label>
          <select
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="source"
            onChange={(event) => {
              setSource(event.target.value);
            }}
            value={source}
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Social Media">Social Media</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="status">
            Status
          </label>
          <select
            className="w-full rounded border border-emerald-300 px-3 py-2 text-sm"
            id="status"
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            value={status}
          >
            <option value="New Lead">New Lead</option>
            <option value="Contacted">Contacted</option>
            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:bg-emerald-300"
            disabled={isSubmitting || anyErrorExists}
            type="submit"
          >
            Update Lead
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLeadPage; // Export page for route usage.
