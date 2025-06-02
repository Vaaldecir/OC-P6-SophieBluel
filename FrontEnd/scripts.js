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
  trash.dataset.workId = element.id; //a modifier pour le placer sur la corbeille

  div.appendChild(img);
  div.appendChild(trash);
  modalGallery.appendChild(div);

  trash.addEventListener("click", () => {
    console.log(trash.dataset.workId);
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

if (token) {
  const edit = document.querySelector(".edit");
  const login = document.querySelector(".login");
  const logout = document.querySelector(".logout");
  const editBanner = document.querySelector(".edit-banner");

  filters.classList.add("hidden");
  edit.classList.remove("hidden");
  logout.classList.remove("hidden");
  login.classList.add("hidden");
  editBanner.classList.remove("hidden");

  logout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  });

  edit.addEventListener("click", () => {
    const exit = document.querySelector(".exit");
    const modal = document.querySelector(".modal");

    editModal.classList.replace("hidden", "logged");

    exit.addEventListener("click", () => {
      editModal.classList.replace("logged", "hidden");
    });

    modal.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        editModal.classList.replace("logged", "hidden");
      }
    });
  });
}
