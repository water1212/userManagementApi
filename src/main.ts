const fs = require('fs');
const path = require('path');
const express = require('express');

//get instance of express
const app = express();

//get all sub folders in routes
let routeDir = `${__dirname}/routes`;

//get the available versions in the routes folder
let availableAPIVersions = fs.readdirSync(routeDir);

//if someone calls the base url of our api, simply return a json object with listed api versions to use.
app.all('/', (req, res) => {
    res.json({apiVersions: availableAPIVersions});
});

//build a list of routes based on available api versions
availableAPIVersions.forEach((version) => {
    let filesInFolder = fs.readdirSync(`${routeDir}/${version}`);
    let availableRoutesForThisVersion: string[] = [];

    filesInFolder.forEach((file) => {
      //the route standard im using is that a file is a route, so we can just remove the .js from the file for the route
      let fileNoExtension = file.replace('.js', '');

      //add the route to the list
      availableRoutesForThisVersion.push(fileNoExtension);

      //add the route to express
      let fileToUse = `${routeDir}/${version}/${fileNoExtension}`;
      app.use(`/${version}/${fileNoExtension}`, require(fileToUse));
    });

    //if no route is specified after the version, return json with available routes for that version
    app.all(`/${version}`, (req, res) => {
        res.json({routesAvaliable: availableRoutesForThisVersion});
    })
});

app.use((req, res, next) => {
    console.error('User attempted to go to a route that is not available');
    //Send a 404 response and a simple message (in json format) explaining that the desired url doesnt exist.
    res.status(404).json({error: `${req.url} does not exist`});
});

let server = app.listen(3000);
console.log('Express started on port 3000');
