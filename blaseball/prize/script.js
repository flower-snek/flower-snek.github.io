/**


obfuscating code is for losers (that probably know what they're doing (as opposed to me (who doesn't know what they're doing))), feel free to make fun of this code (:


**/
const FK_STATS = ["tragicness",
			"buoyancy",
            "thwackability",
            "moxie",
            "divinity",
            "musclitude",
            "patheticism",
            "martyrdom",
            "cinnamon",
            "baseThirst",
            "laserlikeness",
            "continuation",
            "indulgence",
            "groundFriction",
            "shakespearianism",
            "suppression",
            "unthwackability",
            "coldness",
            "overpowerment",
            "ruthlessness",
            "pressurization",
            "omniscience",
            "tenaciousness",
            "watchfulness",
            "anticapitalism",
            "chasiness"] // copied this from another project i was working on

prizesDiv = document.getElementById("prizes");

divs = [];

fetch("https://api.sibr.dev/chronicler/v1/games/updates?search=prize&order=desc")
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		data.data.forEach((update) => {
			updateData = update.data;
			//console.log(updateData);
			if("state" in updateData){
				if("prizeMatch" in updateData.state){
					//console.log(updateData.state.prizeMatch);
					itemId = updateData.state.prizeMatch.itemId; // we'll nab this later
					//first, some stuff
					div = document.createElement("div");
					div.setAttribute("class", "item");
					div.setAttribute("id", itemId);
					//div.setAttribute("onClick", "toggleItem(" + itemId + ")");
					header = document.createElement("h4");
					header.innerHTML = "Season " + (updateData.season+1) + " day " + (updateData.day+1) + ", " + updateData.awayTeamName + " at " + updateData.homeTeamName;
					div.appendChild(header);
					divs.push(div);
					//ok now we're ready:
					fetch("https://cors-proxy.blaseball-reference.com/database/items?ids=" + itemId)
					.then((response) => {
						return response.json();
					}).then((data) => {
						//console.log(data[0]);
						itemData = data[0]; // we only grabbin one
						//show the name, and the stats
						namePara = document.createElement("p");
						namePara.innerHTML = ("Item name: " + itemData.name);
						statsDiv = document.createElement("div");
						statsDiv.setAttribute("class", "stats");
						statsDiv.appendChild(namePara);
						// there are 26 stats, given by id, so im making an array that'll sum up stat changes
						stats = []
						for(var i = 0; i < 26; i++){
							stats.push(0);
						}
						//also keep track of mods
						mods = []
						//and might as well grab durability
						durability = itemData.durability;
						//ok first up: preprefixes, there are none rn but im still doing it
						if(itemData.prePrefix != null){
							itemData.prePrefix.adjustments.forEach((adj) => {
								if(adj.type == 0){
									mods.push(adj.mod);
								}else if(adj.type == 1){
									stats[adj.stat] += adj.value;
								}
							});
						}
						//prefixes (>1!)
						for(i in itemData.prefixes){
							itemData.prefixes[i].adjustments.forEach((adj) => {
								if(adj.type == 0){
									mods.push(adj.mod);
								}else if(adj.type == 1){
									stats[adj.stat] += adj.value;
								}
							});
						}
						//postPrefix
						if(itemData.postPrefix != null){
							itemData.postPrefix.adjustments.forEach((adj) => {
								if(adj.type == 0){
									mods.push(adj.mod);
								}else if(adj.type == 1){
									stats[adj.stat] += adj.value;
								}
							});
						}
						//root
						if(itemData.root != null){
							itemData.root.adjustments.forEach((adj) => {
								if(adj.type == 0){
									mods.push(adj.mod);
								}else if(adj.type == 1){
									stats[adj.stat] += adj.value;
								}
							});
						}
						//suffix
						if(itemData.suffix != null){
							itemData.suffix.adjustments.forEach((adj) => {
								if(adj.type == 0){
									mods.push(adj.mod);
								}else if(adj.type == 1){
									stats[adj.stat] += adj.value;
								}
							});
						}
						//print out in order stats, mods, durability
						for(i in stats){
							if(stats[i] != 0){
								thisStat = document.createElement("p");
								thisStat.innerHTML = FK_STATS[i] + ": " + stats[i];
								statsDiv.appendChild(thisStat);
							}
						}
						for(i in mods){
							thisMod = document.createElement("p");
							thisMod.innerHTML = "Adds mod " + mods[i];
							statsDiv.appendChild(thisMod);
						}
						dur = document.createElement("p");
						dur.innerHTML = "Durability: " + durability;
						statsDiv.appendChild(dur);
						var itemDivIndex;
						var thisItemDiv;
						//console.log(divs.length);
						for(i in divs){
							if(divs[i].id == itemData.id) {
								thisItemDiv = divs[i];
								itemDivIndex = i;
							}
						}
						thisItemDiv.appendChild(statsDiv);
					}).catch((err) => {
						//see other catch below
						var dontyellatme = document.createElement("p");
						dontyellatme.innerHTML = "something went wrong, go yell at snekk or something: <br>" + err; // not too loudly though
						prizesDiv.appendChild(dontyellatme);
					});
					if(prizesDiv.childNodes.length < currentNumberOfDivs){
						prizesDiv.appendChild(div);
					}
				}
			}
		})
		document.getElementById("loading").innerHTML = "";
	})
	.catch((err) => {
		//do i look like i know what to do with an error
		var dontyellatme = document.createElement("p");
		dontyellatme.innerHTML = "something went wrong, go yell at snekk or something: <br>" + err; // not too loudly though
		prizesDiv.appendChild(dontyellatme);
	});

const increment = 5;
var currentNumberOfDivs = increment;

function showMore(){
	for(var i = 0; i < increment && i + currentNumberOfDivs < divs.length; i++){
		prizesDiv.appendChild(divs[currentNumberOfDivs + i]);
	}
	currentNumberOfDivs += increment;
}