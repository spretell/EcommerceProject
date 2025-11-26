// wait until page is loaded to run the script
document.addEventListener("DOMContentLoaded", () => {
  // create const for the form element
  const form = document.getElementById("contact-form");
  // if form is not found , exit the script
  if (!form) return;

  // create const for the status element
  const statusEl = document.getElementById("form-status");

  // create constant that stores all form fields and their validators
  const fields = {
    // settings for name field
    name: {
      // get the name input box
      input: document.getElementById("name"),
      // get the name error message container
      error: document.getElementById("name-error"),
      // check if the name is empty or not
      validator: (value) => (value.trim() ? "" : "Please enter your name."),
    },
    // settings for email field
    email: {
      // get the email input box
      input: document.getElementById("email"),
      // find the email error message container
      error: document.getElementById("email-error"),
      // function to check if the email is valid
      validator: (value) => {
        // if email is empty , show error message
        if (!value.trim()) return "Please enter your email.";
        // expression to check if email format is correct
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if email format is incorrect , show error message
        if (!emailPattern.test(value.trim())) {
          return "Please enter a valid email address.";
        }
        // if email is valid , return empty string
        return "";
      },
    },
    // settings for reason field
    reason: {
      // get the reason input box
      input: document.getElementById("reason"),
      // get the reason error message container
      error: document.getElementById("reason-error"),
      // check if a reason is selected
      validator: (value) =>
        value ? "" : "Please choose a reason for contacting us.",
    },
    // settings for message field
    message: {
      // get the message input box
      input: document.getElementById("message"),
      // get the message error message container
      error: document.getElementById("message-error"),
      // check if the message is at least 10 characters long
      validator: (value) => {
        const trimmed = value.trim();
        // if message is empty , show error message
        if (!trimmed) return "Please add a short message.";
        // if message is less than 10 characters , show error message
        if (trimmed.length < 10) {
          return "Your message should be at least 10 characters long.";
        }
        // if message is valid , return empty string
        return "";
      },
    },
  };

  // create function to clear status message
  function clearStatus() {
    // if the status element is not found , exit the function
    if (!statusEl) return;
    // clear the status message and hide the element
    statusEl.textContent = "";
    // hide the status element
    statusEl.hidden = true;
    // remove any success or error classes
    statusEl.classList.remove("form-status--success", "form-status--error");
  }

  // create function to set status message
  function setStatus(message, type = "success") {
    // if the status element is not found , exit the function
    if (!statusEl) return;
    // set the status message and show the element
    statusEl.textContent = message;
    // show the status element
    statusEl.hidden = false;
    // set the appropriate class based on the type
    statusEl.classList.remove("form-status--success", "form-status--error");
    // add the new class
    statusEl.classList.add(
      type === "error" ? "form-status--error" : "form-status--success"
    );
  }

  // create function to clear field error
  function clearFieldError(field) {
    // mark the field as valid for screen readers
    field.input.setAttribute("aria-invalid", "false");
    // clear the error message if the error container exists
    if (field.error) field.error.textContent = "";
  }

  // create function to set field error
  function setFieldError(field, message) {
    // mark the field as invalid for screen readers
    field.input.setAttribute("aria-invalid", "true");
    // set the error message if the error container exists
    if (field.error) field.error.textContent = message;
  }

  // validate form on submit
  form.addEventListener("submit", (event) => {
    // stop the page from refreshing on submit
    event.preventDefault();
    // clear any previous status messages
    clearStatus();

    // variable to store the first field with an error
    let firstErrorField = null;

    // loop through each form field to validate
    Object.values(fields).forEach((field) => {
      // get the value of the field
      const value = field.input.value;
      // validate the field and get any error message
      const errorMessage = field.validator(value);

      // if there is an error , set the error message
      if (errorMessage) {
        // show the error message for the field
        setFieldError(field, errorMessage);
        // if this is the first error found , store the field to focus later
        if (!firstErrorField) firstErrorField = field.input;
      } else {
        // if no error , clear any previous error message
        clearFieldError(field);
      }
    });

    // if there were any errors , focus the first one and show a status message
    if (firstErrorField) {
      // focus first invalid field
      firstErrorField.focus();
      // show a general error status message
      setStatus("Please fix the errors highlighted below.", "error");
      return;
    }

    // if all fields are valid , reset the form
    form.reset();
    // clear all field error messages
    Object.values(fields).forEach(clearFieldError);

    // show a success status message
    setStatus("Thank you! Your message has been sent.", "success");
  });

  // add validation when the user leaves each field (on blur)
  Object.values(fields).forEach((field) => {
    // listen for when the user leaves the input field
    field.input.addEventListener("blur", () => {
      // get the value inside the field
      const value = field.input.value;
      // run validation on that value
      const errorMessage = field.validator(value);

      // if there is an error , show it
      if (errorMessage) {
        setFieldError(field, errorMessage);
      } else {
        // if no error , clear any previous error message
        clearFieldError(field);
      }
    });
  });
});
