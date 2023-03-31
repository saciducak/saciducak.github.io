const searchForm = document.querySelector(".search-form"); 
const searchButton = document.querySelector("#search-button");

searchButton.addEventListener("click" , function() {
    searchForm.classList.toggle("active");                 /* event listener yoluyla tıklanırsa aç tekrar tıklanırsa kapat diyoruz (toogle) */
    document.addEventListener("click", function (e){
        if(!e.composedPath().includes(searchButton) && !e.composedPath().includes(searchForm) ){
            searchForm.classList.remove("active");                
        }
    })
}); 


const navbarButton = document.querySelector(".navbar");
const menuButton = document.querySelector("#menu-icon");

menuButton.addEventListener("click" , function() {
    navbarButton.classList.toggle("active");                 /* event listener yoluyla tıklanırsa aç tekrar tıklanırsa kapat diyoruz (toogle) */
    document.addEventListener("click", function (e){
        if(!e.composedPath().includes(menuButton) && !e.composedPath().includes(navbarButton) ){
            navbarButton.classList.remove("active");                
        }
    })
}); 