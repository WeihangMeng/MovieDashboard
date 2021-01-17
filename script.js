//model
const CATEGORY = {
  NOWPLAYING: "now_playing",
  POPULAR: "popular",
  TOPRATED: "top_rated",
  UPCOMING: "upcoming"
}

const model = {
  movieList:[],
  movieCardList:[],
  movieDetail:null,
  likedList:[],
  movieCatgory:CATEGORY.POPULAR,
  page:1
}
const apiKey = "?api_key=31846cd2c427dd933fa6849953b3974d";
const url = "https://api.themoviedb.org/3/movie/";
const detailMovie = "https://api.themoviedb.org/3/movie/464052?api_key=31846cd2c427dd933fa6849953b3974d";
const imgLink = "https://image.tmdb.org/t/p/w500/";
//movie info:
//adult: false
// backdrop_path: "/srYya1ZlI97Au4jUYAktDe3avyA.jpg"
// genre_ids: (3) [14, 28, 12]
// id: 464052
// original_language: "en"
// original_title: "Wonder Woman 1984"
// overview: "Wonder Woman comes into conflict with the Soviet Union during the Cold War in the 1980s and finds a formidable foe by the name of the Cheetah."
// popularity: 7833.944
// poster_path: "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg"
// release_date: "2020-12-16"
// title: "Wonder Woman 1984"
// video: false
// vote_average: 7.3
// vote_count: 1766

function readURL(url){
  return fetch(url)
      .then((resp) => {
        if (resp.status >= 200 && resp.status < 300){
          return resp.json();
        }else{
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        // console.log(data);
        const results = data.results;
        model.movieList.push(...results);
        return data;
      })
}
function loadMovieCardList(category, page, movieList){
  readURL(url + category + apiKey + `&page=${page}`)
  .then(() => {
    collectCardInfo(movieList);
  })
  .then(() =>{
    updateView();
  });
}
//controllers
function collectCardInfo(object){
  for (let i = 0; i < object.length; i++){
    const movieId = object[i].id;
    const moviePosterLink = object[i].poster_path;
    const movieRating = object[i].vote_average;
    const movieName = object[i].original_title;
    const newCard = {
      movieId: movieId,
      moviePosterLink: moviePosterLink,
      movieRating: movieRating,
      movieName: movieName
    }
    model.movieCardList.push(newCard);
  }
}
function fetchMovieDetail(id){
  // const detailMovie = "https://api.themoviedb.org/3/movie/464052?api_key=31846cd2c427dd933fa6849953b3974d";
  const detailUrl = `${url}${id}${apiKey}`;
  return fetch(detailUrl).then((resp) => {
    return resp.json();
  })
}
function createCardNode(movie){
  const div = document.createElement("div");
  div.className = "movie";
  div.id = movie.movieId;
  const liked = model.likedList.some((likedMovie) => likedMovie.id === Number(div.id));
  const innerHtml = `
      <img class="movie-poster"src="https://image.tmdb.org/t/p/w500/${movie.moviePosterLink}">
      <div class="movie-name">
        <span>${movie.movieName}</span>
      </div>
      <div class="movie-card-rating">
        <div class='rating'>
          <i class="icon ion-md-star rating-icon"></i>
          <span>${movie.movieRating}</span>
        </div>
        <div>
          <i class="like-icon icon ${
          liked ? "ion-md-heart" : "ion-md-heart-empty"
          }"></i>
        </div>
      </div>


  `;
  div.innerHTML = innerHtml;
  return div;
}
function updateView(){
  if (model.movieCardList){
    const container = document.querySelector(".container");
    container.innerHTML = "";
    model.movieCardList.forEach((movie) => {
      const movieCard = createCardNode(movie);
      container.appendChild(movieCard);
    });
    // model.movieList = [];
    // model.movieCardList = [];
  }
}
function updatePromote(){
  const movieData = model.movieDetail;
  const promoteWindowHTML = `
    <div class="movie-poster">
      <img src = "${imgLink}${movieData.poster_path}">
    </div>
    <div class="movie-detail">
      <h2 class="promote-title">${movieData.title}</h2>
      <h3>Overview</h3>
      <p class="movie-overview">
      ${movieData.overview}
      </p>
      <h3>Genre</h3>
      <div class="genre-container">
        ${movieData.genres.map((item) => {
          return `<div class="genre-item">${item.name}</div>`;
        })}
      </div>
      <h3>Rating</h3>
      <p>${movieData.vote_average}</p>
      <h3>Production Company</h3>
      <div class="production-container">
        ${movieData.production_companies.map((item) => {
          return `
             <div class="production-item">
               <img src="${imgLink}/${item.logo_path}">
              </div>`;
        })}

  `;
  const promoteContent = document.querySelector(".promote-content");
  promoteContent.innerHTML = promoteWindowHTML;
}
function updateCategoryList(){
  model.movieList = [];
  const container = document.querySelector(".container");
  container.innerHTML = "";
  const dropbtn = document.querySelector(".dropbtn");
  const target = event.target;
  if (target.classList.contains("now-playing")){
    model.movieCardList = [];
    model.movieCatgory = CATEGORY.NOWPLAYING;
    loadMovieCardList(model.movieCatgory, model.page, model.movieList);
    dropbtn.innerHTML = "Now playing";
  }
  if (target.classList.contains("popular")){
    model.movieCardList = [];
    model.movieCatgory = CATEGORY.POPULAR;
    loadMovieCardList(model.movieCatgory, model.page, model.movieList);
    dropbtn.innerHTML = "Popular";
  }
  if (target.classList.contains("top-rated")){
    model.movieCardList = [];
    model.movieCatgory = CATEGORY.TOPRATED;
    loadMovieCardList(model.movieCatgory, model.page, model.movieList);
    dropbtn.innerHTML = "Top Rated";
  }
  if (target.classList.contains("upcoming")){
    model.movieCardList = [];
    model.movieCatgory = CATEGORY.UPCOMING;
    loadMovieCardList(model.movieCatgory, model.page, model.movieList);
    dropbtn.innerHTML = "Upcoming";
  }
}
const showPromoteWindow = () => {
  const promoteWindow = document.querySelector("#promote");
  promoteWindow.style.display = "flex";
};

const closePromoteWindow =() => {
  const promoteWindow = document.querySelector("#promote");
  promoteWindow.style.display = "none";
};

const handleClick = (e) => {
  const target = e.target;
  const card = target.closest(".movie");
  if(!card){
    return;
  }
  const movieId = Number(card.id);
  if (target.classList.contains("like-icon")){
    const movieData = model.movieList.find((movie) => movie.id === movieId);

    const alreadylikedList = model.likedList.some((likedMovie)=>likedMovie.id === movieId );
    if(alreadylikedList){
      model.likedList = model.likedList.filter((movie)=> movie.id !== movieId);
    }else{
      model.likedList.push(movieData);
    }
    updateView();
  }

  if(target.classList.contains("movie-name")){
    fetchMovieDetail(card.id)
    .then((movieData) => {
      console.log(movieData);
      model.movieDetail = movieData;
      updatePromote();
      showPromoteWindow();
    });
  }
}
const handleLikedList = (e) => {
  const pageContainer = document.querySelector(".page-container");
  pageContainer.style = "display:none";
  model.movieCardList = [];
  loadMovieCardList(model.movieCatgory, model.page, model.likedList);
  updateView();
};
const handleAllmovie = (e) => {
  const pageContainer = document.querySelector(".page-container");
  pageContainer.style = "display";
  model.movieList = [];
  model.movieCardList = [];
  loadMovieCardList(model.movieCatgory, model.page, model.movieList);
  updateView();
}
const handlePage = (e) => {
  const target = e.target;
  const page = document.querySelector("#currentPage");
  if (target.id === "prevPage"){
    if (model.page === 1){
      model.movieList = [];
      model.movieCardList = [];
      loadMovieCardList(model.movieCatgory, model.page, model.movieList);
      updateView();
    }else{
      model.movieList = [];
      model.movieCardList = [];
      model.page = model.page - 1
      loadMovieCardList(model.movieCatgory, model.page, model.movieList);
      updateView();
      page.innerHTML = `${model.page} / 500`;
    }
  }

  if (target.id === "nextPage"){
    if (model.page === 500){
      model.movieList = [];
      model.movieCardList = [];
      loadMovieCardList(model.movieCatgory, model.page, model.movieList);
      updateView();
    }else{
      model.movieList = [];
      model.movieCardList = [];
      model.page = model.page + 1;
      loadMovieCardList(model.movieCatgory, model.page, model.movieList);
      updateView();
      page.value = page.value + 1;
      page.innerHTML = `${model.page} / 500`;

    }
  }

};
function loadEvents(){
  const dropDown = document.querySelector(".dropdown");
  const listContainer = document.querySelector(".container");
  const likedButton = document.querySelector("#likeList");
  const allMovieButton = document.querySelector("#allMovie");
  const pageContainer = document.querySelector(".page-container");
  const closeButton = document.querySelector(".close");
  loadMovieCardList(model.movieCatgory, model.page, model.movieList);
  closeButton.addEventListener("click", closePromoteWindow);
  dropDown.addEventListener("click", updateCategoryList);
  listContainer.addEventListener("click", handleClick);
  likedButton.addEventListener("click", handleLikedList);
  allMovieButton.addEventListener("click", handleAllmovie);
  pageContainer.addEventListener("click", handlePage);

}
// loadMovieCardList(model.movieCatgory, 1, model.movieList);
// collectDetailInfo(model.movieList[0].id);
loadEvents();
