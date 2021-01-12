const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");
const tableBtn =  document.getElementById("tablebutton");

customBtn.addEventListener("click", function() {
    console.log("Upload image button pressed!");
    realFileBtn.click();
});
  
realFileBtn.addEventListener("change", function() {
    if (realFileBtn.value) {
        var uploadFileName = realFileBtn.value.match(
        /[\/\\]([\w\d\s\.\-\(\)]+)$/
        )[1];
        customTxt.innerHTML = uploadFileName;
        
        const reader = new FileReader();

        reader.addEventListener("load", () =>{
            localStorage.setItem("recent-image", reader.result);
        });
        reader.readAsDataURL(this.files[0]);
        storeImage();
        const recentImageDataUrl = localStorage.getItem("recent-image");
        export{recentImageDataUrl}

  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const recentImageDataUrl = localStorage.getItem("recent-image");

    if (recentImageDataUrl){
      recentImageDataUrl.setAttribute('width', '100px');
        document.querySelector("#imgPreview").setAttribute("src", recentImageDataUrl);
    }
});

tableBtn.addEventListener("click", function() {
    createTable();
});




function createTable() {
    var body = document.body;
    var table = document.createElement('table');
    table.style.width = '75%';
    table.style.border = '1px solid black';
    table.setAttribute('border', '1');
    for (var i = 0; i < 3; i++)
    {
        var tRow = table.insertRow();
        for (var j = 0; j < 2; j++)
        {
            if (i == 2 && j == 1) {
                break;
            }
            else {
                var tData = tRow.insertCell();
                tData.appendChild(document.createTextNode('data here'));
                tData.style.border = '1px solid black';
                if (i == 1 && j == 1) {
                    tData.setAttribute('rowspan', '2');
                }
            }
        }
    }
    body.appendChild(table);
    console.log("create table function has been run");
}

const inpFile = document.getElementById("inpFile")
const previewContainer = document.getElementById("imagePreview")
const previewImage = previewContainer.querySelector(".image-preview__image")
const previewDefaultText = previewContainer.querySelector(".image-preview__default-text")

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
