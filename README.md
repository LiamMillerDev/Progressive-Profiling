# Progressive Flow

Progressive Flow is a JavaScript library that enables progressive profiling forms in Webflow projects. It allows you to create multi-step forms that adapt based on user input and existing data, providing a smoother user experience and potentially increasing form completion rates.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
   - [Basic Setup](#basic-setup)
   - [Form Structure](#form-structure)
   - [Attributes](#attributes)
4. [Customization](#customization)
5. [Troubleshooting](#troubleshooting)
6. [Support](#support)

## Features

- Multi-step form functionality
- Progressive profiling (asks for new information based on existing data)
- Email validation
- Error handling and display
- Smooth transitions between form steps
- Seamless integration with backend data storage

## Installation

To use Progressive Flow in your Webflow project, simply add the following script tag to the `<head>` section of your project:

```html
<script src="https://liammillerdev.github.io/Progressive-Profiling/docs/progressive-flow.min.js"></script>
```

This single line of code is all you need to start using Progressive Flow in your Webflow project.

## Usage

### Basic Setup

1. Create a new form in your Webflow project.
2. Add a form wrapper and give it the attribute `pf="form"`.
3. Inside the form wrapper, create step wrapper divs for each form step.
4. Add input fields and buttons with the appropriate attributes (see [Attributes](#attributes) section).

### Form Structure

Your form should follow this basic structure:

```html
<form pf="form">
  <div pf="step-email">
    <!-- Email input field -->
    <input pf="email" type="email" />
    <button pf="next">Next</button>
  </div>

  <div pf="step-first_name">
    <!-- First name input field -->
    <input pf="first_name" type="text" />
    <button pf="submit">Submit</button>
  </div>

  <!-- Additional steps as needed -->
</form>
```

### Attributes

Use these custom attributes to structure your form:

- `pf="form"`: Applied to the form wrapper
- `pf="step-email"`: Wrapper for the email step (required and must be first)
- `pf="step-first_name"`: Wrapper for the first name step
- `pf="step-last_name"`: Wrapper for the last name step
- `pf="step-company"`: Wrapper for the company step
- `pf="email"`: Applied to the email input field
- `pf="first_name"`: Applied to the first name input field
- `pf="last_name"`: Applied to the last name input field
- `pf="company"`: Applied to the company input field
- `pf="next"`: Applied to the "Next" button (only in the email step)
- `pf="submit"`: Applied to the "Submit" button (in all steps except email)

## Customization

You can customize the appearance of your form using Webflow's design tools. The Progressive Flow script adds minimal styling for error messages and step visibility, allowing you to maintain full control over your form's look and feel.

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages.
2. Ensure all required attributes are correctly applied to your form elements.
3. Verify that the script is properly loaded in your project's `<head>` section.
4. Make sure your form structure matches the recommended layout.

## Support

For additional support or questions about implementing Progressive Flow in your Webflow project, please reach out through our official support channels. We're here to help you create amazing progressive profiling forms with ease!

---

Thank you for choosing Progressive Flow for your Webflow projects. We're excited to see what you create!
