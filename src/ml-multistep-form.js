(function () {
  let currentStep = "email";
  const API_ENDPOINT = "https://x8ki-letl-twmt.n7.xano.io/api:ZvUi_3ML/users";
  const DEBUG = true;
  let userData = null;

  function log(...args) {
    if (DEBUG) console.log("[ML Form]", ...args);
  }

  function initializeMultiStepForm() {
    try {
      addStyles();
      const form = document.querySelector('[ml="form"]');
      if (!form) throw new Error('No form with ml="form" found');

      form.addEventListener("click", handleNavigation);
      form.addEventListener("keydown", handleKeydown);
      showStep("email");
      log("Multi-step form initialized");
    } catch (error) {
      console.error("Error initializing form:", error);
    }
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .error { border-color: red; }
        [ml$="-step"] { display: none; }
        .error-message { color: red; font-size: 12px; margin-top: 5px; }
      `;
    document.head.appendChild(style);
  }

  function handleNavigation(event) {
    const target = event.target;
    if (target.matches('[ml="next"]')) {
      event.preventDefault();
      handleNextStep();
    } else if (target.matches('[ml="submit"]')) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (currentStep === "email") {
        handleNextStep();
      } else {
        handleSubmit();
      }
    }
  }

  async function handleNextStep() {
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
            document.querySelector(`[ml="${currentStep}"]`),
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
  }

  function isUserDataComplete(data) {
    const requiredFields = ["email", "first_name", "last_name", "company"];
    return requiredFields.every(
      (field) => data[field] && data[field].trim() !== ""
    );
  }

  async function fetchUserData(email) {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 404) {
        return { email: email, first_name: "", last_name: "", company: "" };
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
  }

  function determineNextStep() {
    const steps = ["email", "first_name", "last_name", "company"];
    const currentIndex = steps.indexOf(currentStep);
    for (let i = currentIndex + 1; i < steps.length; i++) {
      if (!userData[steps[i]] || userData[steps[i]].trim() === "") {
        return steps[i];
      }
    }
    return null;
  }

  function validateField(field) {
    const input = document.querySelector(`[ml="${field}"]`);
    if (!input || !input.value.trim()) {
      showErrorMessage(input, "This field is required.");
      return false;
    }
    clearErrorMessage(input);
    return field !== "email" || validateEmail(input.value);
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  function showErrorMessage(element, message) {
    clearErrorMessage(element);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    errorMessage.textContent = message;
    element.parentNode.appendChild(errorMessage);
    element.classList.add("error");
  }

  function clearErrorMessage(element) {
    const errorMessage = element.parentNode.querySelector(".error-message");
    if (errorMessage) errorMessage.remove();
    element.classList.remove("error");
  }

  function showStep(step) {
    const stepElement = document.querySelector(`[ml="${step}-step"]`);
    if (stepElement) {
      stepElement.style.display = "block";
      const input = stepElement.querySelector(`[ml="${step}"]`);
      if (input) input.focus();
    }
  }

  function hideStep(step) {
    const stepElement = document.querySelector(`[ml="${step}-step"]`);
    if (stepElement) stepElement.style.display = "none";
  }

  function updateUserData(field) {
    if (!userData) userData = {};
    const input = document.querySelector(`[ml="${field}"]`);
    if (input) userData[field] = input.value;
  }

  async function handleSubmit() {
    try {
      if (!userData || !userData.email) {
        throw new Error("User data is not properly initialized");
      }

      updateUserData(currentStep);
      log("Submitting form with user data:", userData);

      const apiResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.message || "Failed to submit form to API");
      }

      log("Form submitted successfully to API");

      // Update Webflow form fields
      Object.keys(userData).forEach((key) => {
        const input = document.querySelector(`[ml="${key}"]`);
        if (input) input.value = userData[key];
      });

      // Submit the Webflow form
      const form = document.querySelector('[ml="form"]');
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      form.dispatchEvent(submitEvent);
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorMessage(
        document.querySelector(`[ml="${currentStep}"]`),
        error.message || "Failed to submit form. Please try again."
      );
    }
  }

  // Initialize the form when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMultiStepForm);
  } else {
    initializeMultiStepForm();
  }
})();
