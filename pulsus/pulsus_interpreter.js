
const note_size = 72
const maxline = Math.floor((innerWidth*0.8)/note_size)

let colors = [
	"#00afff", // base
	"#ff2277", // chord
	"#ff2222", // bad
	"#ffcc22", // ?
	"#22ff66" // good
];

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
				let n = nts[i][0].n;
				if(n != "-"){
					// draw bg square
					s.fill(20)
					let bx = i % maxline
					let by = Math.floor(i / maxline)
					let cx = note_size/2 + note_size*bx
					let cy = note_size/2 + note_size*by
					//console.log(nts[i])
					s.rect(cx, cy, cs, cs)
					for(let j = 0; j < nts[i].length; j++){
						let note = nts[i][j]
						// console.log(note)
						let val = note.n
						let col = note.col
						//if(c == "!"){
						//	s.fill("#dd4455")
						//}else{
							let num = parseInt(val) - 1
							let x = (num % 3) - 1
							let y = -(Math.floor(num / 3)) + 1
							s.fill(col)
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
	let this_time = [];
	let this_note = {
		n: "",
		col: ""
	};
	let overall_color = ""
	let pause = false;
	for(let i = 0; i < txt.length; i++){
		let skip = false;
		let c = txt.charAt(i);
		if(c == "["){
			if(this_note.col != ""){
				overall_color = this_note.col;
			}
			pause = true
			skip = true
		} else if(c == "]"){
			pause = false
		} else if(c == "!"){
			this_note.col = colors[2]
			skip = true;
		} else if(c == "?"){
			this_note.col = colors[3]
			skip = true;
		} else if(c == "^"){
			this_note.col = colors[4]
			skip = true;
		} else {
			this_note.n = c;
		}
		
		if(!skip){
			if(this_note.n != ""){
				this_time.push(this_note)
			} // this is scuffed
			this_note = {
				n: "",
				col: ""
			}
			
			if(!pause){
				// set color if not already set
				for(let j = 0; j < this_time.length; j++){
					if(overall_color != ""){
						this_time[j].col = overall_color
					}
					if(this_time[j].col == ""){
						this_time[j].col = colors[1]
						if(this_time.length == 1){
							this_time[j].col = colors[0];
						}
					}
				};
				//console.log(this_time)
				pattern.push(this_time);
				this_time = []
				overall_color = "";
			}
			
		}
	}
	if(pause){ // you forgot to put either a ] or something after a color indicator
		pattern.push(this_time);
	}
	
	// console.log(pattern);
	return pattern;
}
let update_colors = function(){
	let color_inputs = document.getElementsByClassName("p_col");
	for(let i = 0; i < color_inputs.length; i++){
		colors[i] = "#" + color_inputs[i].value
	}
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
	update_colors()
	pattern = interpret_pattern(document.getElementById("p_in").value);
	let canvas = sketch_generator(pattern);
	let below = document.getElementById("below")
	let new_div = document.createElement("div")
	below.after(new_div)
	new p5(canvas, new_div);
}