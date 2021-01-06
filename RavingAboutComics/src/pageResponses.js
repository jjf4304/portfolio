const fs = require('fs');

// Constants for the different HTML Files to respond with.
const index = fs.readFileSync(`${__dirname}/../pages/index.html`);

const comicListPage = fs.readFileSync(`${__dirname}/../pages/comicsList.html`);

const comicPage = fs.readFileSync(`${__dirname}/../pages/comic.html`);

const notFoundPage = fs.readFileSync(`${__dirname}/../pages/notFound.html`);

const addPage = fs.readFileSync(`${__dirname}/../pages/addComic.html`);

// Constants for the different CSS files to respond with.
const mainStyle = fs.readFileSync(`${__dirname}/../styles/mainStyles.css`);

const frontPageStyle = fs.readFileSync(`${__dirname}/../styles/frontpageStyles.css`);

const comicCardStyle = fs.readFileSync(`${__dirname}/../styles/smallComicCardStyle.css`);

const comicListStyles = fs.readFileSync(`${__dirname}/../styles/comicListStyles.css`);

const comicPageStyles = fs.readFileSync(`${__dirname}/../styles/comicPageStyles.css`);

//Function to respond with the requested file.
const respond = (request, response, status, content, contentType) => {
  response.writeHead(status, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

// Serve the index page
const getIndex = (request, response) => respond(request, response, 200, index, 'text/html');

//Serve the comics list page
const getComicsList = (request, response) => respond(request, response, 200, comicListPage, 'text/html');

//serve a single comic page
const getComic = (request, response) => respond(request, response, 200, comicPage, 'text/html');

//serve the add comic page
const getAddComic = (request, response) => respond(request, response, 200, addPage, 'text/html');

// Serve the main styles css
const getMainStyle = (request, response) => respond(request, response, 200, mainStyle, 'text/css');

//serve the styles for front page data
const getFrontPageStyle = (request, response) => respond(request, response, 200, frontPageStyle, 'text/css');

//serve the comic card styles
const getComicCardStyle = (request, response) => respond(request, response, 200, comicCardStyle, 'text/css');

//serve the list of comics styles
const getComicListStyles = (request, response) => respond(request, response, 200, comicListStyles, 'text/css');

//serve the single comic styles
const getComicPageStyles = (request, response) => respond(request, response, 200, comicPageStyles, 'text/css');

// Respond to a request for a page that doesn't exist with a JSON response object.
const notFound = (request, response) => respond(request, response, 404, notFoundPage, 'text/html');
module.exports = {
  getIndex,
  getComicsList,
  getComic,
  getAddComic,
  getMainStyle,
  getFrontPageStyle,
  getComicCardStyle,
  getComicPageStyles,
  getComicListStyles,
  notFound,
};
