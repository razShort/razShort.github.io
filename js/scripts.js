/*jslint browser:true */

var darkmodeButton = document.querySelector(".darkmode");
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var currentTheme = localStorage.getItem("theme");
var userChoiseColorMode = prefersDarkScheme.matches ? "dark" : "light";

// first visite on website
if (currentTheme === null) {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", "dark");
  }
}

// activates dark theme if user activated dark mode once
if (currentTheme === "dark") {
  document.body.classList.toggle("dark-theme");
}

darkmodeButton.addEventListener("click", function () {
  document.body.classList.toggle("dark-theme");

  var theme = "light";
  if (document.body.classList.contains("dark-theme")) {
    theme = "dark";
  }
  localStorage.setItem("theme", theme);
});