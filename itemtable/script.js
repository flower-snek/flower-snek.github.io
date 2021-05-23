/**


obfuscating code is for losers (that probably know what they're doing (as opposed to me (who doesn't know what they're doing))), feel free to make fun of this code (:


**/
const order = [0, 1, 2, 3, 4, 5, 6, 7, 14, 15, 16, 17, 18, 19, 9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 8, 20] // stat display order (makes more sense)
const FK_STATS_ABB = ["tragc",
                "buoy",
                "thwck",
                "moxie",
                "divin",
                "muscl",
                "path",
                "mrtyr",
                "cinna",
                "thrst",
                "laser",
                "cont",
                "indlg",
                "frict",
                "shakes",
                "supp",
                "unthwk",
                "cold",
                "ovrpwr",
                "ruth",
                "press",
                "omni",
                "tenac",
                "watch",
                "ancap",
                "chase"] // grabbed from a separate project
var table = document.getElementById("table");

//set up the table like a not idiot this time

var headers = document.createElement("tr")
headers.setAttribute("class", "headers2");
var itemname = document.createElement("td");
itemname.innerHTML = "Item Name";
itemname.setAttribute("onClick", "sortTable(0)");
var owner = document.createElement("td");
owner.innerHTML = "Owner";
owner.setAttribute("onClick", "sortTable(1)");
headers.appendChild(itemname);
headers.appendChild(owner);

for(i in FK_STATS_ABB){
	var td = document.createElement("td");
	td.innerHTML = FK_STATS_ABB[order[i]];
	td.setAttribute("onClick", "sortTable("+(parseInt(i)+2)+")");
	headers.appendChild(td);
}

//var timeCreated = document.createElement("td");
//timeCreated.innerHTML = "Time created";
//timeCreated.setAttribute("onClick", "sortTable(28)");
//headers.appendChild(timeCreated);

table.appendChild(headers);
var items = [];
// i honestly stole this function shell off something i found on google
fetch("https://api.sibr.dev/chronicler/v2/entities?type=player")
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		var playerData = data.items;
		//this is where stuff happens
		//also this is the first time ive done actual javascript hi!
		//goal is to make an array of item objects
		//console.log(playerData)
		
		playerData.forEach((player) => {
			//console.log(player);
			var thisData = player.data;
			//console.log(thisData);
			for(item in thisData.items){
				thisData.items[item].owner = thisData.name;
				items.push(thisData.items[item]);
			}
		});
		//some constants right here for no reason
		//dictate what is good / bad in terms of items
		//might have to adjust eventually
		const vg = 0.3
		const g = 0.15
		const b = -0.15
		const vb = -0.3
		items.forEach((item) => {
			//console.log(item);
			var tr = document.createElement("tr");
			// first, item name and owner, easy
			var itemname = document.createElement("td");
			var owner = document.createElement("td");
			itemname.innerHTML = item.name;
			owner.innerHTML = item.owner;
			tr.appendChild(itemname);
			tr.appendChild(owner);
			//now the stats
			//first i'm creating a list of adjustments. adjustments are attributes on each suffix, root, prefix, etc.
			var adjustments = [];
			//first up, preprefix (none exist rn but you never know)
			var preprefix = item.prePrefix;
			if(preprefix != null){
				for(i in preprefix.adjustments){
					adjustments.push(preprefix.adjustments[i]);
				}
			}
			//there can be more than one prefix!
			var prefixes = item.prefixes
			for(i in prefixes){
				var prefix = prefixes[i]
				if(prefix != null){
					for(j in prefix.adjustments){
						adjustments.push(prefix.adjustments[j]);
					}
				}
			}
			//postprefix
			var postprefix = item.postPrefix
			if(postprefix != null){
				for(j in postprefix.adjustments){
					adjustments.push(postprefix.adjustments[j]);
				}
			}
			//root
			//also you can tell im copy+pasting a ton because 'i' became 'j' a bit ago
			var root = item.root
			if(root != null){
				for(j in root.adjustments){
					adjustments.push(root.adjustments[j]);
				}
			}
			//suffix
			var suffix = item.suffix
			if(suffix != null){
				for(j in suffix.adjustments){
					adjustments.push(suffix.adjustments[j]);
				}
			}
			
			for(var h = 0; h < 26; h++){
				//doing it in a specific order that is NOT 0-25 so i do this awful thing:
				var i = order[h]
				var statValue = 0; // 0 if it doesnt exist
				
				//loop through the adjustments
				for(j in adjustments){
					if(adjustments[j].type == 1){ // not caring about mods or durability rn
						if(adjustments[j].stat == i){
							statValue += adjustments[j].value;
						}
					}
				}
				
				//finally, make and add the cell.
				var td = document.createElement("td");
				td.innerHTML = statValue.toFixed(4);
				if(i != 0 && i != 6){ // not path and trag
					if(statValue >= vg){
						td.setAttribute('class', 'vg');
					}
					else if(statValue >= g){
						td.setAttribute('class', 'g');
					}
					else if(statValue > 0){
						td.setAttribute('class', 'sg');
					}
					else if(statValue <= vb){
						td.setAttribute('class', 'vb');
					}
					else if(statValue <= b){
						td.setAttribute('class', 'b');
					}
					else if(statValue < 0){
						td.setAttribute('class', 'sb');
					}
				}else{
					if(statValue >= vg){
						td.setAttribute('class', 'vb');
					}
					else if(statValue >= g){
						td.setAttribute('class', 'b');
					}
					else if(statValue > 0){
						td.setAttribute('class', 'sb');
					}
					else if(statValue <= vb){
						td.setAttribute('class', 'vg');
					}
					else if(statValue <= b){
						td.setAttribute('class', 'g');
					}
					else if(statValue < 0){
						td.setAttribute('class', 'sg');
					}
				}
				tr.appendChild(td)
			}
			//and append
			table.appendChild(tr);
		});
		//console.log(table);
		document.getElementById("loading").innerHTML = "";
	})
	.catch((err) => {
		//idk????????????????????
	});


//now for some other stuff

//sorting algoritm i literally stole off of w3schools
//https://www.w3schools.com/howto/howto_js_sort_table.asp
//like i said, never actually used js for anything before. dw, i looked through this code and understand it now.
function sortTable(n) {
	var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
	table = document.getElementById("table");
	switching = true;
	// Set the sorting direction to ascending:
	dir = "asc";
	/* Make a loop that will continue until
	no switching has been done: */
	while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.rows;
		/* Loop through all table rows (except the
		first, which contains table headers): */
		for (i = 2; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName("TD")[n];
			y = rows[i + 1].getElementsByTagName("TD")[n];
			/* Check if the two rows should switch place,
			based on the direction, asc or desc: */
			if (dir == "asc") {
				//i added some hardcoding for names vs numbers - the first two will ALWAYS be names, the last 26 ALWAYS numbers
				if(n <= 1){
					if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}else{
					if (Number(x.innerHTML) > Number(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				}
			} else if (dir == "desc") {
				if(n <= 1){
					if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
						// If so, mark as a switch and break the loop:
						shouldSwitch = true;
						break;
					}
				}else{
					if (Number(x.innerHTML) < Number(y.innerHTML)) {
						shouldSwitch = true;
						break;
					}
				}
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			// Each time a switch is done, increase this count by 1:
			switchcount ++;
		} else {
			/* If no switching has been done AND the direction is "asc",
			set the direction to "desc" and run the while loop again. */
			if (switchcount == 0 && dir == "asc") {
				dir = "desc";
				switching = true;
			}
		}
	}
}
// for night/day, and colorblind/not eventually:
const classes =		["vg"  , "g"   , "sg"  , "sb"  , "b"   , "vb"  ];
const day = 		["#7d7", "#9d9", "#bdb", "#dbb", "#d99", "#d77"];
const night = 		["#363", "#252", "#131", "#311", "#522", "#733"];
function toggleNightMode(){
	var mode = document.getElementById("mode");
	if(mode.className == "day"){
		console.log("day -> night");
		//day -> night
		var page = document.getElementsByTagName("html")[0];
		page.style.backgroundColor = "#111";
		page.style.color = "#999";
		Array.from(document.getElementsByTagName("td")).forEach(element => element.style.borderColor = "#666");
		for(i in classes){
			Array.from(document.getElementsByClassName(classes[i])).forEach(element => element.style.backgroundColor = night[i]);
		}
		mode.innerHTML = "&#127773;"
		mode.setAttribute("class", "night");
	}else{
		//night -> day
		console.log("night -> day");
		var page = document.getElementsByTagName("html")[0];
		page.style.backgroundColor = "#ddd";
		page.style.color = "#000";
		Array.from(document.getElementsByTagName("td")).forEach(element => element.style.borderColor = "#000");
		for(i in classes){
			Array.from(document.getElementsByClassName(classes[i])).forEach(element => element.style.backgroundColor = day[i]);
		}
		
		mode.innerHTML = "&#127774;"
		mode.setAttribute("class", "day");
	}
}


function search(){
	var query = document.getElementById("searchbox").value;
	console.log(query);
	var table = document.getElementById("table");
	rows = table.getElementsByTagName("tr");
	for(var i = 2; i < rows.length; i++){
		var name = rows[i].getElementsByTagName("td")[0].innerHTML;
		console.log(name + " " + name.search(query));
		if(name.search(query) == -1){
			rows[i].style.display = "none";
		}else{
			rows[i].style.display = "table-row";
		}
	}
}
