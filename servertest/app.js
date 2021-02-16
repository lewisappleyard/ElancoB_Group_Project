#!/usr/bin/env node

const dotenv = require('dotenv').config()
const express = require('express');
const fileUpload = require('express-fileupload');
const fetch = require('node-fetch');
const path = require('path');

const PORT = process.env.PORT;
const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT;
const AZURE_KEY = process.env.AZURE_KEY;
const DEBUG = process.env.DEBUG;

const app = express();

if (DEBUG) {
    app.all('/*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
}



app.use(express.static('public', {index: 'index.html'}));

app.use(fileUpload());


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/index.html'));
// });


app.get('/api/hello', (req, res) => {
    res.send('hiya');
});


app.post('/api/sampleresponse', (req, res) => {
    if (!req.files || !req.files.img) {
        return res.status(400).json({'status': 'error', 'message': 'No image uploaded'});
    }
    
    res.sendFile(path.join(__dirname + '/sampleresponse.json'));
    
});


app.post('/api/ocr', async (req, res) => {
    if (!req.files || !req.files.img) {
        return res.status(400).json({'status': 'error', 'message': 'No image uploaded'});
    }
    upload = req.files.img;
    console.log("Submitting image...");
    var resp = await fetch(AZURE_ENDPOINT + '/formrecognizer/v2.0/prebuilt/receipt/analyze', {
        method: 'POST',
        body: upload.data,
        headers: {
            'Ocp-Apim-Subscription-Key': AZURE_KEY,
            'Content-Type': 'application/octet-stream'
        }
    });
    console.log("Success");
    resultLocation = await resp.headers.get('Operation-Location');
    var jobStatus = 'running';
    
    while(jobStatus == 'running') {
        await sleep(1000);
        console.log("Polling status...");
        var resp = await fetch(resultLocation, {
            headers: {
                'Ocp-Apim-Subscription-Key': AZURE_KEY
            }
        });
        respData = await resp.json();
        jobStatus = respData['status'];
    }
	
	receipt = respData["analyzeResult"]["documentResults"][0]["fields"]
	
	returnData = {
		"date": receipt["TransactionDate"]["text"],
		"items": [],
		"totalPrice": receipt["Total"]["valueNumber"]
	}
	
	
	
	
	itmCount = receipt["Items"]["valueArray"].length
	
	for (var i = 0; i < itmCount; i++) {
		itm = receipt["Items"]["valueArray"][i]["valueObject"]
		itmName = itm["Name"]["text"]
		itmPrice = itm["TotalPrice"]["valueNumber"]
		returnData["items"][i] = {"name": itmName, "price": itmPrice}
	}
	
	
    console.log("Success");
    res.json(returnData);

});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname + '/public/404.html'));
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
