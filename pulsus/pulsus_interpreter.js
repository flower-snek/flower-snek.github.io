
const note_size = 72
const maxline = Math.floor((innerWidth*0.8)/note_size)

let parent = document.getElementById("the_info");
let note_objects = document.getElementsByClassName("p_notes");

// for each note object here, make a canvas that shows that sequence of notes

let letter2number = function(txt){
	// this is stupid
	return txt.replaceAll("v","1")
	          .replaceAll("b","2")
	          .replaceAll("n","3")
	          .replaceAll("f","4")
	          .replaceAll("g","5")
	          .replaceAll("h","6")
	          .replaceAll("r","7")
	          .replaceAll("t","8")
	          .replaceAll("y","9");
}

let sketch_generator = function(nts){ // i have like 8 different things called notes i dont know how to name variables
	return (s) => {
		let height = note_size * Math.ceil((nts.length)/maxline);
		let width = note_size * Math.min(nts.length, maxline);
		// let note_order = notes;
		s.setup = function() {
			what = s.createCanvas(width, height);
			s.background(0);
			s.rectMode(s.CENTER);
			what.class("notBG")
			
			let cs = note_size * 7/8
			
			for(let i = 0; i < nts.length; i++){
				n = nts[i].n;
				if(n != "-"){
					// draw bg square
					s.fill(20)
					let bx = i % maxline
					let by = Math.floor(i / maxline)
					let cx = note_size/2 + note_size*bx
					let cy = note_size/2 + note_size*by
					// console.log(nts[i])
					s.rect(cx, cy, cs, cs)
					s.fill(nts[i].col)
					for(let j = 0; j < n.length; j++){
						let c = n.charAt(j)
						//if(c == "!"){
						//	s.fill("#dd4455")
						//}else{
							let num = parseInt(c) - 1
							let x = (num % 3) - 1
							let y = -(Math.floor(num / 3)) + 1
							s.rect(cx + x*cs/3, cy + y*cs/3, cs*1/4, cs*1/4)
						//}
					}
				}
			}
		};
	};
};

let interpret_pattern = function(txt){
	txt = letter2number(txt)
	let pattern = [];
	let this_time = {
		n: "",
		col: ""
	}
	let pause = false;
	for(let i = 0; i < txt.length; i++){
		let skip = false;
		let c = txt.charAt(i);
		if(c == "["){
			pause = true
		} else if(c == "]"){
			pause = false
		} else if(c == "!"){
			this_time.col = "#ff0000"
			skip = true;
		} else if(c == "?"){
			this_time.col = "#ffff00"
			skip = true;
		} else if(c == "^"){
			this_time.col = "#00ff00"
			skip = true;
		} else {
			this_time.n += c;
		}
		
		if(!pause && !skip){
			// set color if not already set
			if(this_time.col == ""){
				this_time.col = "#ff0077";
				if(this_time.n.length == 1){
					this_time.col = "#00afff";
				}
			}
			// console.log(this_time)
			pattern.push(this_time);
			
			this_time = {
				n: "",
				col: ""
			}
		}
	}
	if(pause){ // you forgot to put either a ] or something after a color indicator
		pattern.push(this_time);
	}
	
	// console.log(pattern);
	return pattern;
}
/*
let generator = document.getElementById("generator");
if(generator){
	let canvas = (s) => {
		let height = note_size*2
		let width = innerWidth*0.8
		s.setup = function() {
			what = s.createCanvas(width, height);
			s.background(0);
			s.rectMode(s.CENTER);
			what.class("notBG")
			let inp = s.createInput('1234[56]');
			inp.position(0, 0)
			inp.size(width, height)
		}
	}
	new p5(canvas, generator)
}
*/

note_objects.forEach((nobj) => {
	let notes = interpret_pattern(nobj.innerHTML)
	// console.log(notes)
	let canvas = sketch_generator(notes);
	nobj.innerHTML = "";
	new p5(canvas, nobj);
});

let create_pattern = function(){
	pattern = interpret_pattern(document.getElementById("p_in").value);
	let canvas = sketch_generator(pattern);
	let below = document.getElementById("below")
	let new_div = document.createElement("div")
	below.after(new_div)
	new p5(canvas, new_div);
}