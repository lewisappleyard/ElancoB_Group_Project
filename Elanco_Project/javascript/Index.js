const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

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
        
  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const recentImageDataUrl = localStorage.getItem("recent-image");

    if (recentImageDataUrl){
        document.querySelector("#imgPreview").setAttribute("src", recentImageDataUrl);
        
        var img = new Image();
        img = recentImageDataUrl;
        img.onclick = function() {
          window.location.href = 'http://127.0.0.1:5500/Elanco_Project/assets/';
        };
        
    }
});


