// Author: Joshua Fredrickson

/* comics array of comic objects
Structure:
    top Level: "NameOfComic"
        Properties:
        -Title
        -Author
        -Publisher
        -Total Score (set to 0 for a no review comic, else gets changed when adding reviews)
        -Cover Image URL (optional)
        -Reviews, an array of objects
            Structure for a review object:
                -User (Implement later)
                -Score
                -Written Review: (optional)
*/

// My hard coded starting data for the API
// ALL IMAGES ARE THE PROPERTY OF THE PUBLISHERS AND THE ARTISTS
const comics = {
  'Empty Zone': {
    title: 'Empty Zone',
    author: 'Jason Shawn Alexander',
    publisher: 'Image Comics',
    totalScore: 9.5,
    imgURL: 'https://cdn.imagecomics.com/assets/i/releases/19368/empty-zone-1_faf3cdff1a.jpg',
    lastReviewed: Date.now(),
    reviews: [
      {
        score: 9,
        written: '',
        // user tbi
      },
      {
        score: 10,
        written: 'An amazing blend of interesting worlds, strange and broken characters, and wierd happenings.',
        // user tbi
      },
    ],
  },
  'The Crow': {
    title: 'The Crow',
    author: 'James O\'Barr',
    publisher: 'Caliber Comics',
    totalScore: 10,
    imgURL: 'https://upload.wikimedia.org/wikipedia/en/8/85/The_Crow1_Cover.jpg',
    lastReviewed: Date.now(),
    reviews: [
      {
        score: 10,
        written: '',
      },
    ],
  },
  'Carnage, U.S.A.': {
    title: 'Carnage, U.S.A.',
    author: 'Zeb Wells',
    publisher: 'Marvel Comics',
    totalScore: 8,
    imgURL: 'https://vignette.wikia.nocookie.net/marveldatabase/images/b/bd/Carnage%2C_U.S.A._Vol_1_1.jpg',
    lastReviewed: Date.now(),
    reviews: [
      {
        score: 8,
        written: '',
      },
    ],
  },
  'All Star Batman And Robin': {
    title: 'All Star Batman And Robin',
    author: 'Frank Miller',
    publisher: 'DC Comics',
    totalScore: 4,
    imgURL: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Allstarbatmanandrobin01.jpg',
    lastReviewed: Date.now(),
    reviews: [
      {
        score: 4,
        written: '',
      },
    ],
  },
  'Red Lanterns Vol. 4: Blood Brothers': {
    title: 'Red Lanterns Vol. 4: Blood Brothers',
    author: 'Charles Soule',
    publisher: 'DC Comics',
    totalScore: 7,
    imgURL: 'https://www.dccomics.com/sites/default/files/styles/covers192x291/public/gn-covers/2018/05/redlanterns_vol4_bloodbros_5b045b12a93552.91300624.jpg',
    lastReviewed: Date.now(),
    reviews: [
      {
        score: 7,
        written: 'If you like the change to Red Lanterns as more characters than rage villains, you will find a lot to like here. Gives a lot of character to the individual Red Lanterns, but some may find that it feels forced at points to give them empathetic backstories.',
      },
    ],
  },
};

// Function to respond with a json object alongside the status code
const respondJSON = (request, response, status, json) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(json));
  response.end();
};

// Function to respond with just a status code.
const respondMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

// Helper function to generate an error object
const generateError = (id, message) => {
  const errorJson = {};

  errorJson.message = message;
  errorJson.id = id;

  return errorJson;
};

// Sorts the array of comics from highest score to lowest score.
// ref: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
const descendingTotalScore = (a, b) => {
  if (a.totalScore > b.totalScore) { return -1; }
  if (a.totalScore < b.totalScore) return 1;

  return 0;
};

// Sorts an array of comics from most recently reviewed to last reviewed/
// ref: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
const descendingReviewDate = (a, b) => {
  if (a.lastReviewed > b.lastReviewed) return -1;
  if (a.lastReviewed < b.lastReviewed) return 1;

  return 0;
};

// Helper function when adding a review to re-calculate the total score for that comic.
const calculateScore = (titleToUpdate) => {
  let total = 0;
  const numReviews = comics[titleToUpdate].reviews.length;

  for (let i = 0; i < numReviews; i++) {
    total += comics[titleToUpdate].reviews[i].score;
  }

  comics[titleToUpdate].totalScore = (total / numReviews);
};

// Function used to get the top 3 highest scored comics as well as get the three most recent
// reviewed comics.  Returns a object that contains this data.
const getFrontPageData = () => {
  const list = [];

  const listOfKeys = Object.keys(comics);
  for (let i = 0; i < listOfKeys.length; i++) {
    list.push(comics[listOfKeys[i]]);
  }

  // get the top 3 highest scored comics
  const top3 = {};
  if (list.length <= 3) {
    for (let i = 0; i < list.length; i++) {
      top3[list[i].title] = list[i];
    }
  } else {
    let numAdded = 0;
    list.sort(descendingTotalScore);

    for (let i = 0; i < 3; i++) {
      top3[list[i].title] = list[i];
      numAdded++;

      if (numAdded >= 3) break;
    }
  }

  // Get the 3 most recently reviewed.
  const recentReviews = {};
  if (list.length <= 3) {
    for (let i = 0; i < list.length; i++) {
      recentReviews[list[i].title] = list[i];
    }
  } else {
    let numAdded = 0;
    list.sort(descendingReviewDate);

    for (let i = 0; i < 3; i++) {
      recentReviews[list[i].title] = list[i];
      numAdded++;

      if (numAdded >= 3) break;
    }
  }

  const json = {};
  json.top3 = top3;
  json.recentReviews = recentReviews;

  return json;
};

// Returns the comic object indexed by it's title. If that comic doesn't
// exist, return an empty object which will be error checked in getComicData
const getComic = (titleToGet) => {
  if (comics[titleToGet]) {
    const json = comics[titleToGet];
    return json;
  }

  const json = {};
  return json;
};

// Returns a semi copy of the comic object to be returned to the client. Only
// contains the data needed for a comic card in the client, Title, Score,
// and Cover Image URL
const getAllComics = () => {
  const list = {};

  const listOfKeys = Object.keys(comics);
  for (let i = 0; i < listOfKeys.length; i++) {
    const json = {};
    json.title = comics[listOfKeys[i]].title;
    json.imgURL = comics[listOfKeys[i]].imgURL;
    json.totalScore = comics[listOfKeys[i]].totalScore;
    list[json.title] = json;
  }

  return list;
};

// Function to handle incoming GET requests of the comics.
// All GET response calls come from this function.
// Calls relevent functions to provide it with the requested data.
// Checks if parameters are valid/sent correctly, and if so completes the response.
const getComicData = (request, response, params) => {
  // No type parameter given for the request
  if (!params.type) {
    const json = generateError('missingParameters', 'Error: Missing parameter for what type of retrieval.');
    return respondJSON(request, response, 400, json);
  }

  const comicData = {};

  // Type of request for index.html data
  if (params.type === 'front') {
    comicData.data = getFrontPageData();
    return respondJSON(request, response, 200, comicData);
  }
  // Type of request for comic.html data
  if (params.type === 'single') {
    if (!params.title) {
      const errorJson = generateError('missingParameters', 'Error: Missing title parameter of comic to retrieve.');
      return respondJSON(request, response, 400, errorJson);
    }
    // If the comic wasn't found
    if (!comics[params.title]) {
      const errorJson = generateError('notFound', 'Error: Comic not found.');
      return respondJSON(request, response, 404, errorJson);
    }
    comicData.data = getComic(params.title);
    return respondJSON(request, response, 200, comicData.data);
  }

  if (params.type === 'list') {
    comicData.data = getAllComics();
    return respondJSON(request, response, 200, comicData);
  }
  // type of request for comicsList.html
  const errorJson = generateError('badRequest', 'Error: Bad Request. Type parameter invalid.');
  return respondJSON(request, response, 400, errorJson);
};

// Function for handling HEAD reqeusts for comic data. Depending on if the parameters
// are correct respond 200, 400, or 404
const getComicMetaData = (request, response, params) => {
  // No type parameter given for the request
  if (!params.type) {
    return respondMeta(request, response, 400);
  }
  // Type of request for index.html data
  if (params.type === 'front') {
    return respondMeta(request, response, 200);
  }
  // Type of request for comic.html data
  if (params.type === 'single') {
    if (!params.title) {
      return respondMeta(request, response, 400);
    }
    // If the comic wasn't found
    if (!comics[params.title]) {
      return respondMeta(request, response, 404);
    }
    return respondMeta(request, response, 200);
  }
  // type of request for comicsList.html
  if (params.type === 'list') {
    return respondMeta(request, response, 200);
  }

  // Type was bad
  return respondMeta(request, response, 400);
};

// Function to add a review to a comic. Checks if the parameters are good, and if so
// updates the reviews array for that comic, changes the total score to the new one,
// and responds with a 204 for updating the comic.
const addReview = (request, response, reviewToAdd) => {
  if (!reviewToAdd.title || !reviewToAdd.score) {
    const responseJSON = generateError('missingParameters', 'Title and Score are all needed parameters.');

    return respondJSON(request, response, 400, responseJSON);
  }

  const score = parseInt(reviewToAdd.score, 10);
  const review = {
    score,
    written: '',
  };

  if (reviewToAdd.written) {
    review.written = reviewToAdd.written;
  }

  comics[reviewToAdd.title].reviews.push(review);
  calculateScore(reviewToAdd.title);

  comics[reviewToAdd.title].lastReviewed = Date.now();

  return respondMeta(request, response, 204);
};

// Function to add a comic to the listing. Checks if the parameters are correct, and if so
// proceeds. If the comic exists, update it with the sent in author, publisher, and img url data
// then respond with a 204. Else create a new comic object into the listing and fill it with
// the incoming data. Then respond with a 201 cide,
const addComic = (request, response, comicToAdd) => {
  const responseJSON = {
    message: 'Title, Author, Publisher and a URL for the cover are all needed parameters.',
  };

  if (!comicToAdd.title || !comicToAdd.author || !comicToAdd.publisher || !comicToAdd.imgURL) {
    responseJSON.id = 'missingParameters';
    return respondJSON(request, response, 400, responseJSON);
  }

  let statusCode = 201;

  if (comics[comicToAdd.title]) {
    statusCode = 204;
    comics[comicToAdd.title].author = comicToAdd.author;
    comics[comicToAdd.title].publisher = comicToAdd.publisher;
    comics[comicToAdd.title].imgURL = comicToAdd.imgURL;
  } else {
    comics[comicToAdd.title] = {};
    comics[comicToAdd.title].title = comicToAdd.title;
    comics[comicToAdd.title].author = comicToAdd.author;
    comics[comicToAdd.title].publisher = comicToAdd.publisher;
    comics[comicToAdd.title].totalScore = 0;
    comics[comicToAdd.title].lastReviewed = Date.now();
    comics[comicToAdd.title].imgURL = comicToAdd.imgURL;
    comics[comicToAdd.title].reviews = [];
  }

  return respondMeta(request, response, statusCode);
};

// Exports
module.exports = {
  getComicData,
  getComicMetaData,
  addComic,
  addReview,
};
