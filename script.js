//DOM constants
const form = document.getElementById("formSearch"); //Search form
const txtTitle = document.getElementById("txtTitle"); //Title text input field
const numYear = document.getElementById("numYear"); //Year number input field
const results = document.getElementById('results'); //Results section container
const formPages = document.getElementById("formPages"); //Form for page buttons

//Page traversing variables
var currentPage = 1; //Var for tracking current page
var maxPage = 1; //Var for tracking last page

/**
 * Loads movies from API based on value of input fields and places data in DOM
 * @throws {Error} - Caught error if the data can't be fetched from API.
 */
function searchMovie() {
    const loadingMessage = document.createElement('p');//Creates loading container
    //Create constants for the value in input fields
    const title = txtTitle.value;
    const year = numYear.value;

    //Sets up and places loading container
    loadingMessage.textContent = 'Loading Movies...';
    results.appendChild(loadingMessage);

    //Removes any previous movie searches or no result message
    removeIfExists(document.getElementById('movieSet'));
    removeIfExists(document.getElementById('noResult'));

    //Fetches movie data based on title, year, and current page
    fetch(`http://www.omdbapi.com/?s=${title}&y=${year}&page=${currentPage}&apikey=1fc2c350`)
        //Then if response is not ok, throw error, else return the API fetch as parsed data
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP Error\nStatus: ${response.status}`);  
            }
            return response.json();
        })
        //Then use data to show movies, if there are any matches
        .then(data => {
            //Remove the loading container
            results.removeChild(loadingMessage);

            //Figure out max page
            maxPage = Math.ceil(parseInt(data.totalResults) / 10);

            //If there are results in search
            if(data.Response == "True") {
                const containerMovieSet = document.createElement('div'); //Create container to hold all movies
                const search = data.Search; //Instantiate the Search results

                //Set up and place container to hold movies
                containerMovieSet.id = 'movieSet';
                results.appendChild(containerMovieSet);

                //For each key in the results
                for (const key in search) {
                    //Create and set up a movie container
                    const containerMovie = document.createElement('div');
                    containerMovie.id = key;
                    containerMovie.classList.add("movie");

                    //Add movie information
                    containerMovie.innerHTML = `
                        <div class='poster'><img src='${search[key].Poster}'></div>
                        <div class='title'>${search[key].Title}</div>
                        <div class='year'>${search[key].Year}</div>
                        <div class='type'>Type: ${search[key].Type}</div>
                        
                    `;
                    //Append to container to hold movies
                    containerMovieSet.appendChild(containerMovie);
                }
            } else { //Else display a 'no results' message
                const noResultMessage = document.createElement('p');
                noResultMessage.id = "noResult";
                noResultMessage.textContent = `No results for ${title}`;
                results.appendChild(noResultMessage);
            }
            
        })
        //Catch error thrown
        .catch(error => {
            const errorMessage = document.createElement('p'); //Create error message container
            
            //Remove loading message
            results.removeChild(loadingMessage);

            //Add info and append container
            errorMessage.textContent = `Error Fetching data: ${error.message}`;
            results.appendChild(errorMessage);

            //Log it
            console.error('Error Fetcching data: ', error);
        });
}

/**
 * Resets the movie search input fields and the movies displayed.
 */
function reset() {
    txtTitle.value = "";
    numYear.value = "";
    results.innerHTML = "";
}

/**
 * Removes an element if it exists.
 * @param {Element} element - The Element to remove.
 */
function removeIfExists(element) {
    if(element != null) {
        results.removeChild(element);
    }
}

//Event listeners for submit and reset buttons
form.addEventListener("submit", (event) => {
    event.preventDefault(); //Prevents button default behavior

    //If the button pressed is submit
    if (event.submitter.value == 'submit') {
        //Reset current/max page values and search for the movies
        currentPage = 1;
        maxPage = 1;
        searchMovie();
    } else { //Else
        //Reset current/max page values and reset the page
        currentPage = 1;
        maxPage = 1;
        reset();
    }

    //Debug Logging
    console.log('You pressed', event.submitter.value);
});

//Event listener for Next/Previous page buttons
formPages.addEventListener("submit", (event) => {
    event.preventDefault(); //Prevents button default behavior

    //If button pressed is page down
    if (event.submitter.value == 'down') {
        //If the current page is more than 1
        if(currentPage > 1) {
            --currentPage; //Decrement current page
            searchMovie(); //Search for movies on this page
        }
    } else { //Else if button pressed is page up
        //If current page is less than max page
        if(currentPage < maxPage) {
            ++currentPage; //Increment current page
            searchMovie(); //Search for movies on this page
        }
    }

    //Debug logging
    console.log('You pressed', event.submitter.value);
});