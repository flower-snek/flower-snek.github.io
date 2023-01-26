var wheel = document.getElementById("wheel");
var witems = wheel.children[0].children;
var witems_ang = [];
var wheel_rad_final = Math.min(innerWidth, innerHeight) * 0.3;
var wheel_rad = wheel_rad_final * 0.5;
var border_size = wheel_rad_final * 0.4;

var time_since_start = 0;

var prev_ang = 0;
var prev_ang2 = 0;
var mang = 0; // mangoafterdawn reference !!
var start_ang = 0;
var mdown = 0;
var ang_vel = 0.1;
var on_ring = false;

var updateWheelPos = function(){
	for(var i = 0; i < witems.length; i++){
		var titem = witems[i];
		titem.style.left = wheel_rad * Math.sin(witems_ang[i] + mang - start_ang) + "px"
		titem.style.top = -wheel_rad * Math.cos(witems_ang[i] + mang - start_ang) + "px"
	}
}
var updateWheelVel = function(){
	// console.log("move");
	for(var i = 0; i < witems.length; i++){
		witems_ang[i] += ang_vel;
		var titem = witems[i];
		titem.style.left = wheel_rad * Math.sin(witems_ang[i]) + "px"
		titem.style.top = -wheel_rad * Math.cos(witems_ang[i]) + "px"
	}
	ang_vel *= 0.95;
	if(Math.abs(ang_vel) < 0.001){
		clearInterval(wheel_move_int);
	}
}

var dist = function(x1, y1, x2, y2){ return Math.sqrt(Math.pow(y2-y1, 2) + Math.pow(x2-x1, 2)); }

for(var i = 0; i < witems.length; i++){
	witems_ang[i] = 2*Math.PI * (i / witems.length);
	titem = witems[i];
	titem.style.width = border_size + "px";
	titem.style.height = border_size + "px";
}

wheel.style.width = wheel_rad*2 - border_size*2/3 + "px";
wheel.style.height = wheel_rad*2 - border_size*2/3 + "px";
wheel.style.borderWidth = border_size*2/3 + "px";
document.getElementById("the_site").style.width = wheel_rad_final * 0.8 + "px";
document.getElementById("the_site").style.height = wheel_rad_final * 0.8 + "px";

//updateWheelPos();

var outBack = function(x){
	// src easings.net
	const c1 = 1.70158;
	const c3 = c1 + 1;

	return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

var tot_time = 70
var start_wheel_grow = setInterval(() => {
	wheel_rad = wheel_rad_final*0.5 + wheel_rad_final*0.5*outBack(time_since_start/tot_time);
	wheel.style.width = wheel_rad*2 - border_size*2/3 + "px";
	wheel.style.height = wheel_rad*2 - border_size*2/3 + "px";
	if(time_since_start > tot_time) clearInterval(start_wheel_grow);
	time_since_start++;
}, 13);

var wheel_move_int = setInterval(() => {updateWheelVel()}, 13);

document.addEventListener("mousedown", (evt) => {
	if(evt.button == 0 && on_ring){
		mdown = 1;
		start_ang = mang;
		clearInterval(wheel_move_int);
		prev_ang = mang;
		wheel_move_int = setInterval(() => {
			updateWheelPos();
			if(mang < -Math.PI*0.4 && prev_ang > Math.PI*1.4) mang += Math.PI*2;
			if(mang > Math.PI*1.4 && prev_ang < -Math.PI*0.4) mang -= Math.PI*2; // fix the boundary
			//console.log(prev_ang2 + " " + prev_ang + " " + mang);
			// with prev_ang2 theres still a small chance it miscalculates and makes the wheel spin really fast but im not bothering with that tbh
			ang_vel = mang - prev_ang
			prev_ang2 = prev_ang; // so that a last second 0 doesnt make it stop completely
			prev_ang = mang;
		}, 13);
	}
})

document.addEventListener("mouseup", () =>{
	if(mdown == 1){
		clearInterval(wheel_move_int);
		for(var i = 0; i < witems.length; i++){
			witems_ang[i] += mang - start_ang;
		}
		if(prev_ang == 0) ang_vel = mang - prev_ang2;
		wheel_move_int = setInterval(() => {updateWheelVel()}, 13);
		mang = 0;
		start_ang = 0;
		mdown = 0;
	}
})

document.onmousemove = function(evt) {
	mx = evt.pageX;
	my = evt.pageY;
	mang = Math.PI/2 + Math.atan2(my - innerHeight/2, mx - innerWidth/2);
	on_ring = dist(mx, my, innerWidth/2, innerHeight/2) > (wheel_rad - border_size/3) && dist(mx, my, innerWidth/2, innerHeight/2) < (wheel_rad + border_size/3);
	if(on_ring){
		// now check to make sure we aren't on a bright circle
		for(var i = 0; i < witems.length; i++){
			//console.log(dist(mx, my, innerWidth/2 + wheel_rad*Math.sin(witems_ang[i]), innerHeight/2 + wheel_rad*Math.cos(witems_ang[i])));
			if(dist(mx, my, innerWidth/2 + wheel_rad*Math.sin(witems_ang[i]), innerHeight/2 - wheel_rad*Math.cos(witems_ang[i])) < border_size/2){
				on_ring = false;
			}
		}
		if(on_ring){
			document.body.style.cursor = "grab";
		}else{
			document.body.style.cursor = "default";
		}
	}else{
		document.body.style.cursor = "default";
	}
}
