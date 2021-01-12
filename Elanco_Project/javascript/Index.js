const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");
const tableBtn = document.getElementById("table-button");

customBtn.addEventListener("click", function() {
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
        //export{recentImageDataUrl}

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
    import { createReceiptTable } from './JsonToTable.mjs';
    createReceiptTable();
    console.log("table button has been pressed...");
});
