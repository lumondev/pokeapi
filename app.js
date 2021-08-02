const d = document,
  $main = d.querySelector("main"),
  $links = d.querySelector(".links"),
  pokeAPI = "https://pokeapi.co/api/v2/pokemon/?limit=12";

const loadPokemons = async (url) => {
  try {
    $main.innerHTML = `<img src="./assets/tail-spin.svg" class="loader" alt="Cargando...">`;

    let res = await fetch(url),
      json = await res.json(),
      $template = "",
      $prevLink = "",
      $nextLink = "";

    // console.log(json);
    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let pokemon of json.results) {
      try {
        let res = await fetch(pokemon.url),
          pokeJSON = await res.json();
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        let types = pokeJSON.types.map(type => type.type.name);
        // console.log(types);
        typesSrc = types.map(type => `<img src="assets/image/types/${type}.webp" class="type-img" title="${type}"/>`)
        // console.log(typesSrc);
        
        $template += `
            <figure class="card card-${types[0]}">
                <div class="poke-holder card-${types[0]}">
                  <img src="${pokeJSON.sprites.front_default}" alt="${pokeJSON.name}" />
                </div>
                <p class="card-number">#${pokeJSON.id}</p>
                <div class="types">${[...typesSrc].join('')}</div>
                <ficaption>${(pokeJSON.name).toUpperCase()}</figcaption>
            </figure>
        `;
      } catch (error) {
        console.log(error);
        let message = error.statusText || "Ocurrió un error";
        $template += `
            <figure>
                <ficaption>
                    ${error.status}: ${message}
                </figcaption>
            </figure>
        `;
      }
    }

    $main.innerHTML = $template;

    $prevLink = json.previous
      ? `<a href="${json.previous}"><i class="fas fa-backward"></i></a>`
      : "";
    $nextLink = json.next
      ? `<a href="${json.next}"> <i class="fas fa-forward"></i></a>`
      : "";

    $links.innerHTML = $prevLink + " " + $nextLink;
  } catch (err) {
    console.log(err);
    let message = err.statusText || "Ocurrió un error";
    $main.innerHTML = `Error ${err.status} : ${message}`;
  }
};

d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeAPI));

d.addEventListener("click", (e) => {
  if (e.target.matches(".links a")) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute("href"));
  }
});
