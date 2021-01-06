const http = require('http');
const url = require('url');
const query = require('querystring');
const pageResponses = require('./pageResponses.js');
const comicResponses = require('./comicResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Remember to add HEAD requests for ALL requests that get data
// Struct for all the different calls and incoming requests
const urlStruct = {
  GET: {
    '/': pageResponses.getIndex,
    '/index.html': pageResponses.getIndex,
    '/comicsList.html': pageResponses.getComicsList,
    '/comic.html': pageResponses.getComic,
    '/addComic.html': pageResponses.getAddComic,
    '/mainStyles.css': pageResponses.getMainStyle,
    '/frontpageStyles.css': pageResponses.getFrontPageStyle,
    '/smallComicCardStyle.css': pageResponses.getComicCardStyle,
    '/comicPageStyles.css': pageResponses.getComicPageStyles,
    '/comicListStyles.css': pageResponses.getComicListStyles,
    '/getComics': comicResponses.getComicData,
    notFound: pageResponses.notFound,
  },
  HEAD: {
    '/getComics': comicResponses.getComicMetaData,
  },
  POST: {
    '/addComic': comicResponses.addComic,
    '/addReview': comicResponses.addReview,
  },
};

// Function to handle a get or head request (pretty much GET)
// If the pathname exists, call that function and pass it the
// needed parameters if required. Else, respond with notFound page.
const handleGET = (request, response, parsedUrl) => {
  const params = query.parse(parsedUrl.query);

  if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response, params);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

// Function to handle POST requests to the server. If the url exists, start to
// chunk the incoming data for the parameters, then call the related function
// to POST data into the API.
const handlePOST = (request, response, parsedUrl) => {
  if (urlStruct.POST[parsedUrl.pathname]) {
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const params = query.parse(bodyString);

      urlStruct.POST[parsedUrl.pathname](request, response, params);
    });
  }
};

// Function to hanbdle incoming requests. It hands them off to handleGet or
// handlePOST depending on the request method.
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  // If the request was a GET or HEAD request, handle it from URL struct
  // Else handle with POST request to addComic/Review
  if (request.method === 'GET' || request.method === 'HEAD') handleGET(request, response, parsedUrl);

  else handlePOST(request, response, parsedUrl);
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
