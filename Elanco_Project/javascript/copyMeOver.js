'use strict';

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

// temporary declarations for the key and endpoint, can be hidden later to not be exposed in plaintext in the js file
const key = 'key here';
const endpoint = 'endpoint here';
// this could possibly also need a location, not sure?

// Create a new computer vision client obect using the key credentials given
const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

    function computerVision() {
        async.series([
          async function () {

            // Quickstart code should go here, could be wrong and also may want moving/clarifying/testing etc. 

    },
    function () {
      return new Promise((resolve) => {
        resolve();
      })
    }
  ], (err) => {
    throw (err);
  });
}

computerVision();