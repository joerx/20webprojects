const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password-confirmation");

// Show input error message
function showError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  small.innerText = ucfirst(message);
  formControl.className = "form-control error";
}

function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function isValidEmail(text) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(text).toLowerCase());
}

// Replace any sequence of non-word characters in a string with a single space
// Useful to convert id or classnames into more natural readable sequences
// E.g. "foo-bar" becomes "foo bar"
function wordify(str) {
  return str.replace(/[^\w]+/, " ");
}

// Convert the first character of a given string to uppercase
function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function fieldName(input) {
  return wordify(input.id);
}

function checkRequired(inputs) {
  inputs.forEach(function (input) {
    if (input.value.trim() === "") {
      showError(input, `${fieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${fieldName(input)} must be at least ${min} characters`);
  } else if (input.value.length > max) {
    showError(input, `${fieldName(input)} must be less than ${max} characters`);
  } else {
    showSuccess(input);
  }
}

function checkEmail(input) {
  if (!isValidEmail(input.value)) {
    showError(input, `${fieldName(input)} must be a valid email`);
  } else {
    showSuccess(input);
  }
}

function checkMatch(input, reference) {
  if (input.value != reference.value) {
    showError(input, `${fieldName(input)} must match ${fieldName(reference)}`);
  } else {
    showSuccess(input);
  }
}

// Event listener
form.addEventListener("submit", function (e) {
  e.preventDefault();

  checkRequired([username, email, password, password2]);
  checkLength(username, 3, 15);
  checkLength(password, 6, 20);
  checkEmail(email);
  checkMatch(password2, password);
});
