var table = document.getElementById("table");
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
		var items = [];
		playerData.forEach((player) => {
			//console.log(player);
			thisData = player.data;
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
			if(item.name == "Spirit Socks") console.log(item);
			//console.log(item);
			tr = document.createElement("tr");
			// first, item name and owner, easy
			itemname = document.createElement("td");
			owner = document.createElement("td");
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
			//there are 26 of them (8 batting, 6 pitching, 5 running, 5 defense, and 2 vibes)
			var order = [0, 1, 2, 3, 4, 5, 6, 7, 14, 15, 16, 17, 18, 19, 9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 8, 20]
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
				td = document.createElement("td");
				td.innerHTML = statValue.toFixed(4);
				if(i != 0 && i != 6){ // not path and trag
					if(statValue >= vg){
						td.setAttribute('id', 'vg');
					}
					else if(statValue >= g){
						td.setAttribute('id', 'g');
					}
					else if(statValue > 0){
						td.setAttribute('id', 'sg');
					}
					else if(statValue <= vb){
						td.setAttribute('id', 'vb');
					}
					else if(statValue <= b){
						td.setAttribute('id', 'b');
					}
					else if(statValue < 0){
						td.setAttribute('id', 'sb');
					}
				}else{
					if(statValue >= vg){
						td.setAttribute('id', 'vb');
					}
					else if(statValue >= g){
						td.setAttribute('id', 'b');
					}
					else if(statValue > 0){
						td.setAttribute('id', 'sb');
					}
					else if(statValue <= vb){
						td.setAttribute('id', 'vg');
					}
					else if(statValue <= b){
						td.setAttribute('id', 'g');
					}
					else if(statValue < 0){
						td.setAttribute('id', 'sg');
					}
				}
				tr.appendChild(td)
			}
			//and append
			table.appendChild(tr);
		});
		//console.log(table);
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

function toggleMode(){
	
}

