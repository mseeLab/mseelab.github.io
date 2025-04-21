/* JS Document */
/* Main js */

var backToTopShown = true; // used to control back-to-top button appearance and disappearance
var initAnimRunning = true; // monitor whether or not initial anim is running
var just_loaded = true;
var mobile = false;

window.onbeforeunload = function () {
  if (just_loaded) {
    just_loaded = false;
    window.scrollTo(0, 40);
  }
};

function init() {
  checkResize();

  document.getElementById("backToTopBtn").style.opacity = 0;
  // if (!mobile) {
  //   EPPZScrollTo.scrollVerticalToElementById("introDiv", -10); // scroll to start at init
  // }

  var introLines = document.getElementById("introDiv").children; // get children
  function showNextLine(lineNumber) {
    // console.log(lineNumber);
    if (lineNumber < introLines.length && initAnimRunning) {
      introLines[lineNumber].style.opacity = 0;
      fadeIn(introLines[lineNumber]);
      if (lineNumber + 1 == introLines.length) {
        document.getElementById("afterFade").style.display = "inline";
        fadeIn(document.getElementById("afterFade"));
        document.getElementById("afterFade").style.opacity = 1;
      }
      var time = 2000 + (lineNumber > 0) * 1000;
      setTimeout(function () {
        showNextLine(lineNumber + 1);
      }, time);
    } else {
      initAnimRunning = false;
    }
  }
  setTimeout(function () {
    showNextLine(0);
  }, 500);
}

function checkShowfull() {
  if (initAnimRunning) {
    initAnimRunning = false;
    showFull();
  }
}

function showFull() {
  var introLines = document.getElementById("introDiv").children; // get children
  for (var i = 0; i < introLines.length; i++) {
    if (introLines[i].style.opacity == 0 || introLines[i].style.opacity == "") {
      introLines[i].style.opacity = 0;
      fadeIn(introLines[i]);
      document.getElementById("afterFade").style.display = "inline";
      fadeIn(document.getElementById("afterFade"));
      document.getElementById("afterFade").style.opacity = 1;
    }
  }
}

// Makes back-to-top button appear if scrolled down and
function scrollEvt() {
  if (
    document.getElementById("introDiv").getBoundingClientRect().bottom < 700 ||
    (document.getElementById("introDiv").getBoundingClientRect().bottom < 400 &&
      mobile)
  ) {
    checkShowfull();
  }

  if (
    document.getElementById("introDiv").getBoundingClientRect().bottom < 700 &&
    !backToTopShown &&
    mobile
  ) {
    fadeIn(document.getElementById("backToTopBtn"));
    backToTopShown = true;
  } else if (
    document.getElementById("introDiv").getBoundingClientRect().bottom > 700 &&
    backToTopShown
  ) {
    fadeOut(document.getElementById("backToTopBtn"));
    backToTopShown = false;
  }
}

// fade out from http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
function fadeOut(el) {
  (function fade() {
    if ((el.style.opacity -= 0.05) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

// fade in
function fadeIn(el, display) {
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += 0.05) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

function goTo(id) {
  checkShowfull();
  EPPZScrollTo.scrollVerticalToElementById(id, 100);
}

function goToTop() {
  if (mobile) {
    goTo("topdiv");
  } else {
    goTo("introDiv");
  }
}

function checkResize() {
  var style = window
    .getComputedStyle(document.body, null)
    .getPropertyValue("font-size");
  var fontSize = parseFloat(style);
  if (
    window.innerWidth < 900 ||
    window.innerHeight < 800 ||
    window.innerWidth * 1.5 < window.innerHeight ||
    !(fontSize == 18) // 18 checks if using normal (not mobile) css style
  ) {
    mobile = true;
    document.getElementById("sidenav").className = "topnav";
    document.getElementById("main").className = "mainMob";
    document.getElementById("backToTopBtn").style.left = "45%";
    document.body.style.background = "#ecbd3a";
  } else {
    mobile = false;
    document.getElementById("sidenav").className = "sidenav";
    document.getElementById("main").className = "main";
    document.getElementById("backToTopBtn").style.left = "68.25%";
    document.body.style.background = "linear-gradient(#ecbd3a, #d19f15)";
    fadeOut(document.getElementById("backToTopBtn"));
    backToTopShown = false;
  }
}
