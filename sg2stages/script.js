

//been a while since i did js lets see how much i h*ck it up


//first i want to give each thing an onClick attribute soo
let start_table = document.getElementById("stages");
let start_rows = start_table.getElementsByTagName("tr");
for(let i = 0; i < start_rows.length; i++){
	let cells = start_rows[i].getElementsByTagName("td");
	for(let j = 0; j < cells.length; j++){
		if(!cells[j].classList.contains("none")){
			cells[j].setAttribute("onclick", "stageClicked(" + i + ", " + j + ")")
		}
	}
}
//ez



var step = 0;
var banning = -1;
var remainingBans = -1;
const initialBanOrder = "1221"; // need to find an actual ban order one of these days
const afterBanOrder = "3";
var banStep = -1;

var wins = [0,0];
var ft = 2;
function stageClicked(row, column){
	if(remainingBans >= 0){
		toggleSelectBan(row, column);
	}
	
	if(step == 2){
		selectStage(row, column);
	}
	setInstructionsBasedOnStep()
}

function setInstructionsBasedOnStep(){
	if(step == 0){
		// initial setup
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		step_para.innerHTML = "Are you banning first, or is your opponent banning first?";
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		button1.innerHTML = "I'm banning";
		button1.setAttribute("onclick", "setFirstBan(0)")
		button2.innerHTML = "Opponent's banning";
		button2.setAttribute("onclick", "setFirstBan(1)")
	} else if(step == 1){
		// banning phase
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		if(banning == 0){
			step_para.innerHTML = "Your bans.";
		}
		if(banning == 1){
			step_para.innerHTML = "Opponent's bans.";
		}
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		if(remainingBans > 0){
			button1.innerHTML = "Remaining bans: " + remainingBans;
			button1.removeAttribute("onclick")
		}else{
			button1.innerHTML = "Click to confirm";
			button1.setAttribute("onclick", "confirmBansInit()")
		}
		button2.innerHTML = "----";
		button2.removeAttribute("onclick")
	} else if(step == 2){
		// pick!
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		if(banning == 0){
			step_para.innerHTML = "Pick your stage!";
		}
		if(banning == 1){
			step_para.innerHTML = "Opponent picks their stage!";
		}
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		button1.innerHTML = "----";
		button1.removeAttribute("onclick")
		button2.innerHTML = "----";
		button2.removeAttribute("onclick")
	} else if(step == 3){
		// gotta play the game now :pensive:
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		step_para.innerHTML = "Stage selected. Play your match, and select the winner below when you're finished.";
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		button1.innerHTML = "I won";
		button1.setAttribute("onclick", "roundWon(0)")
		button2.innerHTML = "Opponent won";
		button2.setAttribute("onclick", "roundWon(1)")
	} else if(step == 4){
		// back to banning!
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		if(banning == 0){
			step_para.innerHTML = "Your bans.";
		}
		if(banning == 1){
			step_para.innerHTML = "Opponent's bans.";
		}
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		if(remainingBans > 0){
			button1.innerHTML = "Remaining bans: " + remainingBans;
			button1.removeAttribute("onclick")
		}else{
			button1.innerHTML = "Click to confirm";
			button1.setAttribute("onclick", "confirmBans()")
		}
		button2.innerHTML = "----";
		button2.removeAttribute("onclick")
	} else if(step == 5){
		// you won! or maybe you didn't. idk. i'm just a comment.
		let inst_div = document.getElementById("instructions");
		let step_para = document.getElementById("step");
		
		step_para.innerHTML = "Final score: " + wins[0] + " - " + wins[1];
		
		let button1 = inst_div.getElementsByClassName("button")[0];
		let button2 = inst_div.getElementsByClassName("button")[1];
		button1.innerHTML = "Click to reset";
		button1.setAttribute("onclick", "reset()")
		button2.innerHTML = "----";
		button2.removeAttribute("onclick")
	} else {
		let error = document.getElementById("step")
		error.innerHTML = "Something went wrong somewhere, sorry! Click to restart.";
		error.setAttribute("onclick", "reset()")
	}
}

function setFirstBan(player){
	banning = player;
	banStep = 0;
	remainingBans = parseInt(initialBanOrder.charAt(banStep));
	step++;
	setInstructionsBasedOnStep();
}

function confirmBansInit(){
	let rows = document.getElementById("stages").getElementsByTagName("tr");
	for(let i = 0; i < rows.length; i++){
		let cells = rows[i].getElementsByTagName("td");
		for(let j = 0; j < cells.length; j++){
			if (cells[j].classList.contains("selectbanned")){
				cells[j].classList.remove("selectbanned")
				cells[j].classList.add("banned")
			}
		}
	}
	banStep++;
	banning = 1 - banning;
	if(banStep >= initialBanOrder.length){
		step++;
	}else{
		remainingBans = parseInt(initialBanOrder.charAt(banStep));
	}
	setInstructionsBasedOnStep();
}

function confirmBans(){
	let rows = document.getElementById("stages").getElementsByTagName("tr");
	for(let i = 0; i < rows.length; i++){
		let cells = rows[i].getElementsByTagName("td");
		for(let j = 0; j < cells.length; j++){
			if (cells[j].classList.contains("selectbanned")){
				cells[j].classList.remove("selectbanned")
				cells[j].classList.add("banned")
			}
		}
	}
	banStep++;
	banning = 1 - banning;
	if(banStep >= afterBanOrder.length){
		step = 2;
	}else{
		remainingBans = parseInt(afterBanOrder.charAt(banStep));
	}
	setInstructionsBasedOnStep();
}

function toggleSelectBan(row, column){
	let cell = document.getElementById("stages").getElementsByTagName("tr")[row].getElementsByTagName("td")[column] // long lines wooo!
	if (!cell.classList.contains("banned")){
		if (cell.classList.contains("selectbanned")){
			cell.classList.remove("selectbanned");
			remainingBans++;
		}else if(remainingBans > 0){
			cell.classList.add("selectbanned")
			remainingBans--;
		}
	}
}

function selectStage(row, column){
	let cell = document.getElementById("stages").getElementsByTagName("tr")[row].getElementsByTagName("td")[column] // long lines wooo!
	if (!cell.classList.contains("banned")){
		cell.classList.add("select")
		step++;
	}
}

function roundWon(player){
	wins[player]++;
	if(wins[player] >= ft){
		step = 5;
		banning = player;
	}else{
		step++;
		resetBans();
		banStep = 0;
		remainingBans = parseInt(afterBanOrder.charAt(banStep));
		banning = player;
	}
	updateScore();
	setInstructionsBasedOnStep();
}

function reset(){
	resetBans();
	step = 0;
	banning = -1;
	remainingBans = -1;
	banStep = -1;
	wins = [0,0];
	
	updateScore();
	setInstructionsBasedOnStep();
}
function resetBans(){
	let rows = document.getElementById("stages").getElementsByTagName("tr");
	for(let i = 0; i < rows.length; i++){
		let cells = rows[i].getElementsByTagName("td");
		for(let j = 0; j < cells.length; j++){
			cells[j].classList.remove("banned", "selectbanned", "select");
		}
	}
}

function togglebestof(){
	if (step <= 1){
		ft = ((ft - 1) % 3) + 2;
		let bestof = document.getElementById("best");
		bestof.innerHTML = "Best of " + (ft * 2 - 1);
	}
}

function updateScore(){
	let score = document.getElementById("score");
	score.innerHTML = "Current score: " + wins[0] + " - " + wins[1];
}

//finish setup
setInstructionsBasedOnStep();