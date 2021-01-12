const inpFile = document.getElementById("inpFile")
const previewContainer = document.getElementById("imagePreview")
const previewImage = previewContainer.querySelector(".image-preview__image")
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")

const tableCreator = require('./JsonToTable');

inpFile.addEventListener("change", function(){
  const file = this.files[0];

  console.log(file);

  if(file){
    const reader = new FileReader();

    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener("load", function(){
        previewImage.setAttribute("src", this.result);
    });

    reader.readAsDataURL(file);
  }
});


tableBtn.addEventListener("click", function() {
    tableCreator.createReceiptTable();
    console.log("table button has been pressed...");
});