//import ApiCall from './main.js';
const inpFile = document.getElementById("inpFile");
const submitRebate = document.getElementById("rebateSubmition");
const previewContainer = document.getElementById("imagePreview");
const previewImage = previewContainer.querySelector(".image-preview__image");
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text");

submitRebate.addEventListener("click", function(){//submit rebate button
    alert("rebate submitted, thank you");
});

inpFile.addEventListener("change", function(){//scan image button (inpfile)
    previewImage.setAttribute("src", "");
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




// FOR DRAG AND DROP
var dropArea = document.getElementById('drop-area');

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
})

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
    dropArea.classList.add('highlight')
}
function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
	fileInp.files = dt.files;

    files = Array.from(files);
    files.forEach(previewFile);
}

function previewFile(files) {
    previewImage.setAttribute("src", "");
    const file = files[0];
    inpFile.files[0] = file;

    console.log("this is files");
    console.log(files);
    console.log("this is the file");
    console.log(file);

    let reader = new FileReader();

    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";

    reader.addEventListener("load", function(){
        previewImage.setAttribute("src", this.result);
    });

    reader.readAsDataURL(files);
}
