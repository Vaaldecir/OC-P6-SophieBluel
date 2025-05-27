const form = document.querySelector("form");
console.log(form);

// @ts-ignore
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // @ts-ignore
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
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
      if (!response.ok) {
        alert("Utilisateur inconnu");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      sessionStorage.setItem("token", data.token);
      window.location.href = "index.html";
    });
});
