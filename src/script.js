// script.js
const BASE_URL = "https://api.themoviedb.org/3";

// Toggle favoritos
function ativarFavorito(movieElement) {
    const movieFav = movieElement.querySelector(".movie-fav");
    const favIcon = movieFav.querySelector("img");
    const favText = movieFav.querySelector("p");

    movieFav.addEventListener("click", () => {
        const isFav = movieElement.classList.toggle("favorite");
        favIcon.src = isFav ? "src/img/fullheart.svg" : "src/img/heart.svg";
        favText.textContent = isFav ? "Favorito" : "Favoritar";
        filtrarFilmes();
    });
}

// Checkbox favoritos
const favCheckbox = document.getElementById("fav-checkbox");
favCheckbox.addEventListener("click", () => {
    favCheckbox.classList.toggle("checked");
    filtrarFilmes();
});

// Filtrar filmes
function filtrarFilmes() {
    const mostrarApenasFav = favCheckbox.classList.contains("checked");
    const termo = document.getElementById("search-input").value.toLowerCase();

    document.querySelectorAll(".movie").forEach(movie => {
        const estaFavorito = movie.classList.contains("favorite");
        const nome = movie.querySelector(".movie-name p").textContent.toLowerCase();
        const mostrar = (!mostrarApenasFav || estaFavorito) && nome.includes(termo);

        if (mostrar) movie.classList.remove("hide");
        else movie.classList.add("hide");
    });
}

// Renderizar filme
function renderMovie(movie) {
    const container = document.getElementById("movies");

    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    movieElement.innerHTML = `
        <div class="movie-image">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} Poster">
        </div>
        <div class="movie-information">
            <div class="movie-name"><p>${movie.title} (${new Date(movie.release_date).getFullYear()})</p></div>
            <div class="movie-details">
                <div class="movie-rate"><img src="src/img/star.svg" alt=""><p>${movie.vote_average.toFixed(1)}</p></div>
                <div class="movie-fav">
                    <img src="src/img/heart.svg" alt="">
                    <p>Favoritar</p>
                </div>
            </div>
        </div>
        <div class="movie-description">
            <div class="movie-text">${movie.overview || "Descrição não disponível."}</div>
        </div>
    `;

    container.appendChild(movieElement);
    ativarFavorito(movieElement);

    // Ver mais / Ver menos
    const description = movieElement.querySelector(".movie-description");
    const spanText = description.querySelector(".movie-text");

    setTimeout(() => {
        const lineHeight = parseFloat(getComputedStyle(spanText).lineHeight);
        const maxLines = 5; // Máximo de linhas
        const maxHeight = lineHeight * maxLines;

        if (spanText.scrollHeight > maxHeight) {
            spanText.style.maxHeight = `${maxHeight}px`;
            spanText.style.overflow = "hidden";

            const btn = document.createElement("span");
            btn.classList.add("movie-description-button");
            btn.textContent = "Ver mais";
            description.appendChild(btn);

            btn.addEventListener("click", () => {
                const isExpanded = spanText.classList.toggle("expanded");
                spanText.style.maxHeight = isExpanded ? "none" : `${maxHeight}px`;
                btn.textContent = isExpanded ? "Ver menos" : "Ver mais";
            });
        }
    }, 50);
}

// Input pesquisa
document.getElementById("search-input").addEventListener("input", filtrarFilmes);

// Buscar filmes populares da API
async function getPopularMovies() {
    try {
        const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
        const response = await fetch(url);
        const data = await response.json();

        const container = document.getElementById("movies");
        container.innerHTML = ""; // limpa apenas os filmes
        data.results.forEach(movie => renderMovie(movie));
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
    }
}

// Inicialização
window.onload = getPopularMovies;