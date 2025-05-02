const gallery = document.querySelector(".gallery");

const works = fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      console.error(response.status + response.statusText);
    }
  })
  .then((data) => {
    console.log(data);
    data.forEach((element) => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");
      img.src = element.imageUrl;
      img.alt = element.title;
      figcaption.innerText = element.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  });
