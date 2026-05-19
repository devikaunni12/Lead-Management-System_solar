/**
 * This page lets users create a new lead using a step-by-step form.
 * Each field and each error is stored in its own state variable for beginner clarity.
 */

import { FormEvent } from "react"; // FormEvent type is used for form submit event typing.
import { useState } from "react"; // useState stores form values and validation errors.
import { useNavigate } from "react-router-dom"; // useNavigate redirects user after successful form submit.

import { createNewLead } from "../api/leadsApi"; // createNewLead sends form data to backend POST endpoint.
import { LeadFormData } from "../types/lead"; // LeadFormData type defines shape of form payload.

// This component renders the add lead form page.
function AddLeadPage() {
  /**
   * Shows a lead creation form and submits valid data to backend.
   *
   * Input:
   * - No direct input.
   *
   * Returns:
   * - JSX form page.
   */

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
  // systemSizeKw stores numeric input as text for easier input control.
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

  // submitErrorMessage stores error shown when API request fails.
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>("");
  // isSubmitting disables button during API request.
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // navigate lets us move to /leads after success.
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

  // This function checks solar system size range.
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

  // This function validates all fields and updates all error states.
  function validateForm(): boolean {
    /**
     * Runs all validation rules and stores error messages.
     *
     * Input:
     * - No direct input. Uses current form states.
     *
     * Returns:
     * - true if form is valid, false if any field has error.
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

  // This function handles submit button click.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    /**
     * Prevents default submit, validates form, sends create request, and redirects on success.
     *
     * Input:
     * - event: form submit event.
     *
     * Returns:
     * - Promise<void>
     */

    event.preventDefault();
    setSubmitErrorMessage("");

    const formIsValid = validateForm();
    if (formIsValid === false) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newLeadData: LeadFormData = {
        full_name: fullName,
        phone: phone,
        email: email,
        location: location,
        property_type: propertyType as LeadFormData["property_type"],
        system_size_kw: Number(systemSizeKw),
        source: source as LeadFormData["source"],
        status: status as LeadFormData["status"],
      };

      await createNewLead(newLeadData);
      navigate("/leads");
    } catch (error) {
      setSubmitErrorMessage("Could not create lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // anyErrorExists helps us disable submit button if any error text is present.
  const anyErrorExists =
    fullNameError !== "" ||
    phoneError !== "" ||
    emailError !== "" ||
    locationError !== "" ||
    systemSizeKwError !== "";

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-emerald-200 bg-white p-5 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-emerald-800">Add New Lead</h1>

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
          {submitErrorMessage !== "" && <p className="mb-2 text-sm text-red-600">{submitErrorMessage}</p>}
          <button
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:bg-emerald-300"
            disabled={isSubmitting || anyErrorExists}
            type="submit"
          >
            Save Lead
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLeadPage; // Export page for route usage.
