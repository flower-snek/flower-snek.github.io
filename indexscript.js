const randomStrings = [
"yo its me i guess",
"graphic design is my passion",
"what are you looking for",
"wow i need to add more stuff to this page maybe someday"
]

var afterText = document.getElementById("after_text");
afterText.innerText = randomStrings[Math.floor(Math.random()*randomStrings.length)];

// p5js time //////////////////////////////////////////////////////////////////////////
//luckily i want the canvas to be in the bg, otherwise id probably have to do some stupid stuff
var lines, noiseval, offset;
function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  lines = [];
  var pos = -100;
  var i = 0;
  while(pos < height){
    var newLine = {};
    newLine.pos = pos;
    var lineHeight = Math.random() * 50;
    newLine.size = lineHeight;
    pos += lineHeight;
	newLine.shade = i % 2;
	i++;
    lines.push(newLine);
    //print(pos);
  }
  noiseval = 413;
  offset = 0;
}

function draw() {
	background(0);
	//alternate color
	const opac = 10;
	for(var i = 0; i < lines.length; i++){
		if(lines[i].shade == 0){
			fill(255, opac);
		}else{
			fill(0, 0);
		}
		//print(lines[i].pos + " " + (lines[i].pos + lines[i].size));
		rect(0, lines[i].pos + offset, width, lines[i].size);
		if(lines[i].pos + offset > height){ // clean up clean up everybody do your share
			lines.splice(i, 1);
			i--;
		}
	}
	noiseval+=0.03;
	// print(noise(noiseval))
	offset += noise(noiseval)*2;
	if(lines[0].pos + offset > 0){
		var newLine = {};
		var lineHeight = Math.random() * 50;
		newLine.pos = lines[0].pos - lineHeight;
		newLine.size = lineHeight;
		newLine.shade = (lines[0].shade + 1) % 2;
		lines.unshift(newLine);
	}
}