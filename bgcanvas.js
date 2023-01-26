var height = Math.max(innerHeight, document.body.clientHeight);

var canvas = function(p){
	var dots = [];
	p.setup = function(){
		p.createCanvas(innerWidth, height);
		// p.background(13, 9, 11);
	}
	p.draw = function(){
		p.background(13, 9, 11);
		// dot object will be an array with x, y, z, vel
		for(var i = 0; i < 3; i++){
			dots.push([Math.random() * innerWidth, Math.random() * -height*0.1, Math.random() * 10, 0]);
		}
		for(var i = dots.length-1; i >= 0; i--){
			var thisdot = dots[i];
			// depth determines speed and stroke color
			// z=0: color 250,100,190
			// z=10: color 50,30,70
			p.strokeWeight(2);
			p.stroke(250 - 20*thisdot[2], 100 - 7*thisdot[2], 190 - 12*thisdot[2]);
			var len = 20 - thisdot[2]*0.5;
			// draw the line now
			p.line(thisdot[0], thisdot[1], thisdot[0], thisdot[1] + thisdot[3]*1.3);
			// and accelerate and velocity and etc
			thisdot[1] += thisdot[3];
			thisdot[3] += 1.5 - thisdot[2]*0.1
			thisdot[3] *= 0.95;
			if(thisdot[1] > height*1.5) dots.splice(i, 1);
			//console.log(thisdot[1]);
		}
	}
	p.windowResized = function() {
	  height = Math.max(innerHeight, document.body.clientHeight);
	  p.resizeCanvas(innerWidth, height);
	}
}
new p5(canvas, 'bg');