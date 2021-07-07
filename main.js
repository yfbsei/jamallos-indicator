 document.querySelector(".social button").addEventListener("click", () => window.location.href="#target");

 const slideDelay = 3000;

   const dynamicSlider = document.getElementById("slider");

   var curSlide = 0;
   window.setInterval(()=>{
     curSlide++;
     if (curSlide === dynamicSlider.childElementCount) {curSlide = 0;}

     // Actual slide
     dynamicSlider.firstElementChild.style.setProperty("margin-left", "-" + curSlide + "00%");
   }, slideDelay);

   function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

  document.querySelector(".plan button").addEventListener("click", () => location.replace("plans.html") )

