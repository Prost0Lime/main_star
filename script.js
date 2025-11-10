const star = document.getElementById("star");
const memory = document.getElementById("memory");
const back = document.getElementById("back");

star.addEventListener("click", () => {
  memory.classList.remove("hidden");
  window.scrollTo(0, 0);
});

back.addEventListener("click", () => {
  memory.classList.add("hidden");
});