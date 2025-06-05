// @ts-nocheck
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const editModal = document.querySelector(".modal");

const works = fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    data.forEach((element) => {
      addWorkToMainGallery(element);
      addWorkToModalGallery(element);
    });
  });

const addWorkToMainGallery = (element) => {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = element.imageUrl;
  img.alt = element.title;
  figcaption.innerText = element.title;
  figure.dataset.categoryId = element.categoryId;
  figure.dataset.workId = element.id;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
};

const addWorkToModalGallery = (element) => {
  const modalGallery = document.querySelector(".modal-gallery");
  const div = document.createElement("div");
  const img = document.createElement("img");
  const trash = document.createElement("i");

  img.src = element.imageUrl;
  img.alt = element.title;
  div.classList.add("modal-photo");
  trash.classList.add("fa", "fa-trash", "delete");
  trash.dataset.workId = element.id;

  div.appendChild(img);
  div.appendChild(trash);
  modalGallery.appendChild(div);

  trash.addEventListener("click", () => {
    fetch(`http://localhost:5678/api/works/${trash.dataset.workId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).then((response) => {
      if (response.ok) {
        gallery
          .querySelector(`[data-work-id="${trash.dataset.workId}"]`)
          .classList.add("hidden");
        div.classList.add("hidden");
      } else {
        console.error(response.status + response.statusText);
      }
    });
  });
};

const categories = fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    addFilter({ id: 0, name: "Tous" });
    data.forEach((category) => {
      addFilter(category);
    });
  });

const addFilter = (filter) => {
  const button = document.createElement("button");

  button.innerText = filter.name;
  filters.appendChild(button);
  button.classList.add("filter-btn");

  button.addEventListener("click", (event) => {
    const figuresNodes = gallery.querySelectorAll("figure");
    const figuresArray = Array.from(figuresNodes);
    const allButtons = document.querySelectorAll(".filter-btn");

    allButtons.forEach((btn) => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    figuresArray.forEach((figure) => {
      if (filter.id === 0 || Number(figure.dataset.categoryId) === filter.id) {
        figure.classList.remove("hidden");
      } else if (Number(figure.dataset.categoryId) !== filter.id) {
        figure.classList.add("hidden");
      }
    });
  });
};

const token = sessionStorage.getItem("token");

//If there's a Token
if (token) {
  const edit = document.querySelector(".edit");
  const login = document.querySelector(".login");
  const logout = document.querySelector(".logout");
  const editBanner = document.querySelector(".edit-banner");

  // display/hide the following
  filters.classList.add("hidden");
  edit.classList.remove("hidden");
  logout.classList.remove("hidden");
  login.classList.add("hidden");
  editBanner.classList.remove("hidden");

  //when we want to log out, remove the token
  logout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  });

  // when we click the edit button
  edit.addEventListener("click", () => {
    const exit = document.querySelector(".exit");
    const modal = document.querySelector(".modal");
    const modalBtn = document.querySelector(".modal-button");

    // a modal is displayed
    editModal.classList.replace("hidden", "logged");

    // hide the modal when we click the exit button
    exit.addEventListener("click", () => {
      editModal.classList.replace("logged", "hidden");
    });

    // also hide the modal when we click outside the modal window
    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        editModal.classList.replace("logged", "hidden");
      }
    });

    // when we click the button "ajouter des photos"
    modalBtn.addEventListener("click", () => {
      const titleModal = document.querySelector("#titlemodal");
      const modalGallery = document.querySelector(".modal-gallery");
      const returnIcon = document.querySelector(".return");
      const secondTitle = document.querySelector(".add-photo-title");
      const imgUploadForm = document.querySelector(".upload-photos");
      const label = document.querySelector(".image-label");

      // hide the gallery page and display the form page
      returnIcon.classList.remove("hidden");
      secondTitle.classList.replace("hidden", "page-2");
      imgUploadForm.classList.replace("hidden", "page-2");
      label.classList.replace("hidden", "page-2");
      titleModal.classList.add("hidden");
      modalGallery.classList.replace("page-1", "hidden");
      modalBtn.classList.replace("display-btn", "hidden");

      //When we click the left arrow
      returnIcon.addEventListener("click", () => {
        //Go back to the gallery page
        returnIcon.classList.add("hidden");
        secondTitle.classList.replace("page-2", "hidden");
        imgUploadForm.classList.replace("page-2", "hidden");
        label.classList.replace("page-2", "hidden");
        titleModal.classList.remove("hidden");
        modalGallery.classList.replace("hidden", "page-1");
        modalBtn.classList.replace("hidden", "display-btn");
      });
    });
  });
}
