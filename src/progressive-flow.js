// Constants
const API_ENDPOINT = "https://x8ki-letl-twmt.n7.xano.io/api:ZvUi_3ML/users";
const DEBUG = true;
const STEPS = ["email", "first_name", "last_name", "company"];

// State
let currentStep = "email";
let userData = null;

// Utility functions
const log = (...args) => DEBUG && console.log("[ProgressiveFlow]", ...args);
const validateEmail = (email) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    String(email).toLowerCase()
  );
const isUserDataComplete = (data) =>
  STEPS.every((field) => data?.[field]?.trim() !== "");

// DOM manipulation functions
const addStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .error { border-color: red; }
    [pf\\:step] { display: none; }
    .error-message { color: red; font-size: 12px; margin-top: 5px; }
  `;
  document.head.appendChild(style);
};

const showErrorMessage = (element, message) => {
  clearErrorMessage(element);
  const errorMessage = document.createElement("div");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;
  element.parentNode.appendChild(errorMessage);
  element.classList.add("error");
};

const clearErrorMessage = (element) => {
  element.parentNode.querySelector(".error-message")?.remove();
  element.classList.remove("error");
};

const showStep = (step) => {
  const stepElement = document.querySelector(`[pf\\:step="${step}"]`);
  if (stepElement) {
    stepElement.style.display = "block";
    stepElement.querySelector(`[pf\\:${step}]`)?.focus();
  }
};

const hideStep = (step) => {
  const stepElement = document.querySelector(`[pf\\:step="${step}"]`);
  if (stepElement) {
    stepElement.style.display = "none";
  }
};

// API functions
const fetchUserData = async (email) => {
  try {
    const response = await fetch(
      `${API_ENDPOINT}/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 404) {
      return { email, first_name: "", last_name: "", company: "" };
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user data");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    throw error;
  }
};

const submitUserData = async (userData) => {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit form to API");
  }

  return response.json();
};

// Form handling functions
const initializeProgressiveFlow = () => {
  try {
    addStyles();
    const form = document.querySelector("[pf\\:form]");
    if (!form) throw new Error("No form with pf:form found");

    form.addEventListener("click", handleNavigation);
    form.addEventListener("keydown", handleKeydown);
    showStep("email");
    log("ProgressiveFlow form initialized");
  } catch (error) {
    console.error("Error initializing form:", error);
  }
};

const handleNavigation = (event) => {
  const target = event.target;
  if (target.matches("[pf\\:next]")) {
    event.preventDefault();
    handleNextStep();
  } else if (target.matches("[pf\\:submit]")) {
    event.preventDefault();
    handleSubmit();
  }
};

const handleKeydown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    currentStep === "email" ? handleNextStep() : handleSubmit();
  }
};

const handleNextStep = async () => {
  if (validateField(currentStep)) {
    updateUserData(currentStep);
    if (currentStep === "email") {
      try {
        userData = await fetchUserData(userData.email);
        log("User data fetched:", userData);
        if (isUserDataComplete(userData)) {
          await handleSubmit();
          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showErrorMessage(
          document.querySelector(`[pf\\:${currentStep}]`),
          error.message
        );
        return;
      }
    }
    const nextStep = determineNextStep();
    if (nextStep) {
      hideStep(currentStep);
      showStep(nextStep);
      currentStep = nextStep;
    } else {
      await handleSubmit();
    }
  }
};

const determineNextStep = () => {
  const currentIndex = STEPS.indexOf(currentStep);
  return STEPS.slice(currentIndex + 1).find(
    (step) => !userData?.[step]?.trim()
  );
};

const validateField = (field) => {
  const input = document.querySelector(`[pf\\:${field}]`);
  if (!input?.value.trim()) {
    showErrorMessage(input, "This field is required.");
    return false;
  }
  clearErrorMessage(input);
  return field !== "email" || validateEmail(input.value);
};

const updateUserData = (field) => {
  if (!userData) userData = {};
  const input = document.querySelector(`[pf\\:${field}]`);
  if (input) userData[field] = input.value;
};

const handleSubmit = async () => {
  try {
    if (!userData?.email) {
      throw new Error("User data is not properly initialized");
    }

    updateUserData(currentStep);
    log("Submitting form with user data:", userData);

    await submitUserData(userData);
    log("Form submitted successfully to API");

    // Update Webflow form fields
    Object.entries(userData).forEach(([key, value]) => {
      const input = document.querySelector(`[pf\\:${key}]`);
      if (input) input.value = value;
    });

    // Submit the Webflow form
    const form = document.querySelector("[pf\\:form]");
    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(submitEvent);
  } catch (error) {
    console.error("Error submitting form:", error);
    showErrorMessage(
      document.querySelector(`[pf\\:${currentStep}]`),
      error.message || "Failed to submit form. Please try again."
    );
  }
};

// Initialize the form when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeProgressiveFlow);
} else {
  initializeProgressiveFlow();
}
