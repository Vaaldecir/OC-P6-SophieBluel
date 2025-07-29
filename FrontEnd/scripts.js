// @ts-nocheck
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const editModal = document.querySelector(".modal");

// fetch the work already in the API
const works = fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      //if there's a problem, display the status and message problem
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    // if not, for each element in the API, see the following functions
    data.forEach((element) => {
      addWorkToMainGallery(element);
      addWorkToModalGallery(element);
    });
  });

// this function display the work images into the main gallery
const addWorkToMainGallery = (element) => {
  // create HTML elements
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  // go find and attach the image and title to the elements
  img.src = element.imageUrl;
  img.alt = element.title;
  figcaption.innerText = element.title;
  // ad the required IDs
  figure.dataset.categoryId = element.categoryId;
  figure.dataset.workId = element.id;

  // attach the created elements to the gallery section
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
};

// this function display the work images into the modal when in edit mode
const addWorkToModalGallery = (element) => {
  const modalGallery = document.querySelector(".modal-gallery");
  // create HTML elements
  const div = document.createElement("div");
  const img = document.createElement("img");
  const trash = document.createElement("i");

  // go find and attach the image and title to the elements
  img.src = element.imageUrl;
  img.alt = element.title;
  // add some required class to the element
  div.classList.add("modal-photo");
  trash.classList.add("fa", "fa-trash", "delete");
  // ad the required IDs
  trash.dataset.workId = element.id;

  // attach the created elements to the modal gallery section
  div.appendChild(img);
  div.appendChild(trash);
  modalGallery.appendChild(div);

  // when the trash is clicked
  trash.addEventListener("click", () => {
    // fetch the API to delete the work
    fetch(`http://localhost:5678/api/works/${trash.dataset.workId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      // if the workId matches and there's a token
      if (response.ok) {
        // also hide the work in the main gallery
        gallery
          .querySelector(`[data-work-id="${trash.dataset.workId}"]`)
          .classList.add("hidden");
        div.classList.add("hidden");
      } else {
        // if not, alert the user that a problem occured
        alert(response.status + response.statusText);
      }
    });
  });
};

// fetch the categories already in the API
const categories = fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      // if there's a problem, display the status and message problem
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    // if not, for each element in the API, see the following functions
    // also add a default button to display all the works
    addFilterToMainGallery({ id: 0, name: "Tous" });
    data.forEach((category) => {
      addFilterToMainGallery(category);
      addCategoryToModalForm(category);
    });
  });

//this function add filter buttons to the main gallery
const addFilterToMainGallery = (filter) => {
  // create HTML element
  const button = document.createElement("button");

  // go find and attach the name to the element
  button.innerText = filter.name;
  // add the required class
  button.classList.add("filter-btn");

  // attach the element to the main gallery
  filters.appendChild(button);

  // if we click on the button
  button.addEventListener("click", (event) => {
    const figuresNodes = gallery.querySelectorAll("figure");
    const figuresArray = Array.from(figuresNodes);
    const allButtons = document.querySelectorAll(".filter-btn");

    //remove the selected class to all buttons
    allButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    //add the selected class to the button clicked
    button.classList.add("selected");

    //search into the gallery images
    figuresArray.forEach((figure) => {
      //if the filter ID is equal to 0 or the image ID
      if (filter.id === 0 || Number(figure.dataset.categoryId) === filter.id) {
        //we display the image
        figure.classList.remove("hidden");
        //if that's not the case
      } else if (Number(figure.dataset.categoryId) !== filter.id) {
        //we hide it
        figure.classList.add("hidden");
      }
    });
  });
};

//this function add category selection to the form
const addCategoryToModalForm = (filter) => {
  const categoryInput = editModal.querySelector("#category");
  // create HTML element
  const option = document.createElement("option");

  // go find and attach the name to the element
  option.innerText = filter.name;
  option.value = filter.id;

  // attach the element to the main gallery
  categoryInput.appendChild(option);
};

const token = sessionStorage.getItem("token");

// If there's a Token
if (token) {
  const edit = document.querySelector(".edit");
  const login = document.querySelector(".login");
  const logout = document.querySelector(".logout");
  const editBanner = document.querySelector(".edit-banner");

  const imgUploadForm = document.querySelector("#image-form");
  const imgInput = document.querySelector("#image");
  const previewImg = document.querySelector("#preview");
  const titleInput = document.querySelector(".image-title");
  const categorySelect = document.querySelector("#category");
  const submitBtn = document.querySelector(".form-button");
  const label = document.querySelector(".image-label");

  const titleModal = document.querySelector("#titlemodal");
  const modalGallery = document.querySelector(".modal-gallery");
  const returnIcon = document.querySelector(".return");
  const secondTitle = document.querySelector(".add-photo-title");
  const modalBtn = document.querySelector(".modal-button");
  const exit = document.querySelector(".exit");

  // display/hide the following
  filters.classList.add("hidden");
  edit.classList.remove("hidden");
  logout.classList.remove("hidden");
  login.classList.add("hidden");
  editBanner.classList.remove("hidden");

  // when we want to log out, remove the token
  logout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  });

  //This function change the main modal page to the form page
  const showFormPage = () => {
    returnIcon.classList.remove("hidden");
    secondTitle.classList.replace("hidden", "page-2");
    imgUploadForm.classList.replace("hidden", "page-2");
    label.classList.replace("hidden", "page-2");
    titleModal.classList.add("hidden");
    modalGallery.classList.replace("page-1", "hidden");
    modalBtn.classList.replace("display-btn", "hidden");
  };

  // this function reset the form and the modal go back to the main page
  const resetModal = () => {
    //Return to the first page
    document.querySelector(".return").classList.add("hidden");
    document
      .querySelector(".add-photo-title")
      .classList.replace("page-2", "hidden");
    document.querySelector("#image-form").classList.replace("page-2", "hidden");
    document
      .querySelector(".image-label")
      .classList.replace("page-2", "hidden");
    document.querySelector("#titlemodal").classList.remove("hidden");
    document
      .querySelector(".modal-gallery")
      .classList.replace("hidden", "page-1");
    document
      .querySelector(".modal-button")
      .classList.replace("hidden", "display-btn");

    //reset form
    document.querySelector("#image-form").reset();
    document.querySelector("#preview").classList.add("hidden");

    // reset form button
    const submitBtn = document.querySelector(".form-button");
    submitBtn.disabled = true;
    submitBtn.classList.replace("fulfilled", "unfulfilled");
  };

  // when we click the edit button
  edit.addEventListener("click", () => {
    // a modal is displayed
    editModal.classList.replace("hidden", "logged");

    // hide the modal when we click the exit button
    exit.addEventListener("click", () => {
      editModal.classList.replace("logged", "hidden");
      resetModal();
    });

    // also hide the modal when we click outside the modal window
    editModal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        editModal.classList.replace("logged", "hidden");
        resetModal();
      }
    });

    // when we click the button "ajouter des photos", hide the gallery page and display the form page
    modalBtn.addEventListener("click", showFormPage);

    // When we click the left arrow
    returnIcon.addEventListener("click", resetModal);

    // Check if the form is completed
    const checkFormValidity = () => {
      if (
        imgInput.files.length > 0 &&
        titleInput.value.trim() !== "" &&
        categorySelect.value !== ""
      ) {
        submitBtn.disabled = false;
        submitBtn.classList.replace("unfulfilled", "fulfilled");
      } else {
        submitBtn.disabled = true;
        submitBtn.classList.replace("fulfilled", "unfulfilled");
      }
    };

    imgInput.addEventListener("change", () => {
      checkFormValidity();

      const file = imgInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewImg.classList.remove("hidden");
          label.classList.replace("page-2", "hidden");
        };
        reader.readAsDataURL(file);
      } else {
        previewImg.classList.add("hidden");
        label.classList.replace("hidden", "page-2");
      }
    });

    titleInput.addEventListener("input", checkFormValidity);
    categorySelect.addEventListener("change", checkFormValidity);
  });

  // When we submit the form
  imgUploadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(imgUploadForm);
    const image = formData.get("image");
    const title = formData.get("title");
    const category = formData.get("category");

    console.log(formData);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          alert("Erreur lors de l'envoi du formulaire");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Formulaire envoyé avec succès :", data);

        // add the new work to the main and the modal gallery
        addWorkToMainGallery(data);
        addWorkToModalGallery(data);
        editModal.classList.replace("logged", "hidden");
        resetModal();
      });
  });
}
