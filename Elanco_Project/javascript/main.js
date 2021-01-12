const { FormRecognizerClient, FormTrainingClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const fs = require("fs");
const path = require("path");

const apiKey = '4a71bfacb4814c35a28c7ba817620f50';
const endpoint = 'https://elancoproject.cognitiveservices.azure.com/';


//const recentImageDataUrl = localStorage.getItem("recent-image");
const trainingClient = new FormTrainingClient(endpoint, new AzureKeyCredential(apiKey));
const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(apiKey));

async function recognizeContent() {
    //path.join(__dirname, "./assets/contoso-allinone.jpg");
    const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/simple-invoice.png";
    //const formUrl = "C:\Users\tomfy\Desktop\ElancoB_Group_Project\Elanco_Project\assets\MountPleasantReceipt.png"
    const poller = await client.beginRecognizeContentFromUrl(formUrl);
    const pages = await poller.pollUntilDone();

    if (!pages || pages.length === 0) {
        throw new Error("Expecting non-empty list of pages!");
    }

    for (const page of pages) {
        console.log(
            `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
        );
        for (const table of page.tables) {
            for (const cell of table.cells) {
                console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
            }
        }
    }
}

recognizeContent().catch((err) => {
    console.error("The sample encountered an error:", err);
});