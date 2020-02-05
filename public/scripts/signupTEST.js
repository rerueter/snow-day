console.warn("signupTest.js");
const form = document.getElementById("signupForm");

form.addEventListener("submit", handleSignUp);

function handleSignUp(event) {
  event.preventDefault();
  if ($(".ui.form").form("is valid")) {
    console.log("success");
  }
}

$(".ui.form").form({
  fields: {
    username: {
      identifier: "name",
      rules: [
        {
          type: "empty",
          prompt: "Please enter a username."
        },
        {
          type: "minLength[5]",
          prompt: "Your username must be at least {ruleValue} characters long."
        }
      ]
    },
    email: {
      identifier: "email",
      rules: [
        {
          type: "empty",
          prompt: "Please enter an e-mail address."
        }
      ]
    },
    password: {
      identifier: "password",
      rules: [
        {
          type: "empty",
          prompt: "Please enter a password."
        },
        {
          type: "minLength[5]",
          prompt: "Your password must be at least {ruleValue} characters long."
        }
      ]
    },
    passwordConfirm: {
      identifier: "passwordConfirm",
      rules: [
        {
          type: "empty",
          prompt: "Please confirm your password."
        },
        {
          type: "match[password]",
          prompt: "The passwords submitted do not match."
        }
      ]
    },
    proficiency: {
      identifier: "proficiency",
      rules: [
        {
          type: "empty",
          prompt: "Please select your skill level"
        }
      ]
    }
  }
});
/* Semantic UI */
$(".ui.dropdown").dropdown();