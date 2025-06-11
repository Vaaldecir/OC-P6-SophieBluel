// @ts-nocheck
const form = document.querySelector("form");

//When the user submit its IDs
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  // Go search for the right IDs in the API
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((response) => {
      // if the mail and/or password doesn't match
      if (!response.ok) {
        // Alert the user that there's a problem
        alert("Utilisateur inconnu");
      }
      return response.json();
    })
    .then((data) => {
      // if the IDs match, then create a token and go back to the main page
      console.log(data);
      sessionStorage.setItem("token", data.token);
      window.location.href = "index.html";
    });
});
