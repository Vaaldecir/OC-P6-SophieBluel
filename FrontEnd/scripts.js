const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

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
    });
  });

const categories = fetch("http://localhost:5678/api/categories")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    // data.unshift({ id: 0, name: "Tous" });
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
