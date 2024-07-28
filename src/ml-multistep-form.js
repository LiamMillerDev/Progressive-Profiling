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
        [ml$="-step"] { display: none; transition: opacity 0.3s ease-in-out; }
        .error-message { color: red; font-size: 12px; margin-top: 5px; }
      `;
    document.head.appendChild(style);
  }

  function handleNavigation(event) {
    const target = event.target;
    if (target.matches('[ml="next"]')) {
      event.preventDefault();
      handleEmailStep();
    } else if (target.matches('[ml="submit"]')) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (currentStep === "email") {
        handleEmailStep();
      } else {
        handleSubmit();
      }
    }
  }

  async function handleEmailStep() {
    const emailInput = document.querySelector('[ml="email"]');
    if (emailInput && validateEmail(emailInput.value)) {
      try {
        userData = await fetchUserData(emailInput.value);
        log("User data fetched:", userData);
        const nextField = determineNextField(userData);
        if (nextField) {
          hideStep("email");
          showStep(nextField);
          currentStep = nextField;
        } else {
          showAllFieldsFilledMessage();
        }
      } catch (error) {
        console.error("Error handling email step:", error);
        showErrorMessage(emailInput, error.message);
      }
    } else {
      showErrorMessage(emailInput, "Please enter a valid email address.");
    }
  }

  async function fetchUserData(email) {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        // User not found, return a new user object
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

  function determineNextField(userData) {
    const fields = ["first_name", "last_name", "company"];
    return fields.find((field) => !userData[field]) || null;
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
    if (element.tagName === "INPUT") {
      element.classList.add("error");
    }
  }

  function clearErrorMessage(element) {
    const errorMessage = element.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
    if (element.tagName === "INPUT") {
      element.classList.remove("error");
    }
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

  function showAllFieldsFilledMessage() {
    const form = document.querySelector('[ml="form"]');
    form.innerHTML =
      "<h2>Thank you! We already have all your information.</h2>";
  }

  async function handleSubmit() {
    if (!userData) {
      console.error("User data is not initialized");
      return;
    }
    if (validateField(currentStep)) {
      updateUserData(currentStep);
      await submitForm();
    }
  }

  function validateField(field) {
    const input = document.querySelector(`[ml="${field}"]`);
    if (!input || !input.value.trim()) {
      showErrorMessage(
        input || document.querySelector(`[ml="${field}-step"]`),
        "This field is required."
      );
      return false;
    }
    clearErrorMessage(input);
    return true;
  }

  function updateUserData(field) {
    if (!userData) {
      console.error("User data is not initialized");
      return;
    }
    const input = document.querySelector(`[ml="${field}"]`);
    if (input) {
      userData[field] = input.value;
    }
  }

  async function submitForm() {
    try {
      if (!userData || !userData.email) {
        throw new Error("User data is not properly initialized");
      }

      log("Submitting form with user data:", userData);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      const result = await response.json();
      log("Form submitted successfully:", result);

      // Show next field or success message
      const nextField = determineNextField(userData);
      if (nextField) {
        hideStep(currentStep);
        showStep(nextField);
        currentStep = nextField;
      } else {
        // All fields are filled, show success message
        const form = document.querySelector('[ml="form"]');
        form.innerHTML =
          "<h2>Thank you! Your information has been submitted successfully.</h2>";
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorMessage(
        document.querySelector(`[ml="${currentStep}-step"]`),
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
