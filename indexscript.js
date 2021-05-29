const randomStrings = [
"yo its me i guess",
"graphic design is my passion",
"what are you looking at",
"wow i need to add more stuff to this page maybe someday"
]

var afterText = document.getElementById("after_text");
afterText.innerText = randomStrings[Math.floor(Math.random()*randomStrings.length)];