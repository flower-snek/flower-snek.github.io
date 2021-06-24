
//dont make fun of my code thanks


const order = [0, 1, 2, 3, 4, 5, 6, 7, 14, 15, 16, 17, 18, 19, 9, 10, 11, 12, 13, 21, 22, 23, 24, 25, 8, 20] // stat display order (makes more sense)
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
                "chase"] // this too

partiesDiv = document.getElementById("parties");

var divs = [];
const increment = 100;
var currentShown = 0;

showMore();

async function showMore(){
	document.getElementById("loading").innerHTML = "loading . . .";
	await retrieveParties(increment, currentShown);
	currentShown += increment;
	document.getElementById("loading").innerHTML = "";
}

async function retrieveParties(count, offset){
	//ASYNCHRONOUS FUNCTIONS HURT MY BRAIN I HATE THIS but its actually kinda cool and keeps stuff in order which is good but also AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	var partyList = await fetch("https://api.sibr.dev/eventually/v2/events?type=117&description=Partying&sortby=created&sortorder=desc&limit="+count+"&offset="+offset)
		.then((response) => {
			return response.json();
		});
	//console.log(partyList);
	//now retrieve all pre-party stats
	var prepartyPromises = [];
	partyList.forEach((party) => {
		//right now: can I find the stat change from the party?
		//this'll require a pull from chronicler for each party so I should be more careful with this but oh well
		//get the player id and the time this happened, though we'll need to adjust the time a bit because the two databases arent quite synced
		var playerid = party.playerTags[0];
		var timeString = party.created.split("+")[0];
		prepartyPromises.push(fetch("https://api.sibr.dev/chronicler/v1/players/updates?player="+playerid+"&order=desc&count=1&before="+timeString+"Z") // this will get stats prior to party
			.then((response) => {
				return response.json();
			})
			.then((changes) => {
				return changes.data[0];
			})
			.catch((err) => {
				//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA x2
				console.log(err);
			})
		);
	});
	var prepartyArray = []
	await Promise.all(prepartyPromises).then((data) => {
		prepartyArray = data;
	});
	//wait this is actually working????
	//ok uhhh now get postparty stats
	var postpartyPromises = [];
	prepartyArray.forEach((prepartyData) => {
		//console.log(prepartyData);
		//now we get the post-party data!
		//the time we look after will have to be just before the next change, ill just splice off the tail end of the time...
		var playerid = prepartyData.playerId;
		var timeStringPost = prepartyData.lastSeen.split(".")[0];
		//console.log(timeStringPost);
		postpartyPromises.push(fetch("https://api.sibr.dev/chronicler/v1/players/updates?player="+playerid+"&order=asc&count=1&after="+timeStringPost+"Z")
			.then((response) => {
				return response.json();
			})
			.then((changesPost) => {
				if(changesPost.data != null){
					return changesPost.data[0];
				}else{
					return null; // the time string used will be invalid when chronicler hasnt updated the party yet. returning null and will check for null Later(tm)
				}
			})
			.catch((err) => {
				//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
				console.log(err);
			})
		);
	});
	var postpartyArray = [];
	await Promise.all(postpartyPromises).then((data) => {
		postpartyArray = data;
	});
	//well. didn't think i'd get this far. now i can go through each party and display stats and stuff. neat!
	
	for(var i = 0; i < count; i++){
		var thisEvent = partyList[i];
		var thisPreparty = prepartyArray[i];
		var thisPostparty = postpartyArray[i];
		//hey look its Later(tm)
		var thisDiv = document.createElement("div");
		thisDiv.setAttribute("class", "party");
		var header = document.createElement("h4");
		header.innerHTML = "Season " + (parseInt(thisEvent.season)+1) + ", day " + (thisEvent.day+1) + ": " + thisEvent.description;
		thisDiv.appendChild(header);
		if(thisPostparty != null){
			//im thinking a table of before, after, change. sounds good.
			var tableDiv = document.createElement("div");
			var table = document.createElement("table");
			var headers = document.createElement("tr");
			headers.appendChild(document.createElement("td")); // empty one at first, then fill in the stats in the Funny Order
			var before = document.createElement("tr");
			var beforeCell = document.createElement("td");
			beforeCell.innerHTML = "Before";
			before.appendChild(beforeCell);
			var after = document.createElement("tr");
			var afterCell = document.createElement("td");
			afterCell.innerHTML = "After";
			after.appendChild(afterCell);
			var change = document.createElement("tr");
			var changeCell = document.createElement("td");
			changeCell.innerHTML = "Change";
			change.appendChild(changeCell);
			for(var j = 0; j < order.length; j++){
				var s = order[j];
				var pre = thisPreparty.data[FK_STATS[s]];
				var post = thisPostparty.data[FK_STATS[s]];
				var headerCell = document.createElement("td");
				headerCell.innerHTML = FK_STATS_ABB[s];
				headers.appendChild(headerCell);
				var beforeCell = document.createElement("td");
				beforeCell.innerHTML = pre.toFixed(4);
				colorFromVal(beforeCell, pre, (s == 0 || s == 6 ? -1 : 1));
				before.appendChild(beforeCell);
				var afterCell = document.createElement("td");
				afterCell.innerHTML = post.toFixed(4);
				colorFromVal(afterCell, post, (s == 0 || s == 6 ? -1 : 1));
				after.appendChild(afterCell);
				var changeCell = document.createElement("td");
				changeCell.innerHTML = (post - pre).toFixed(4);
				change.appendChild(changeCell);
			}
			table.appendChild(headers);
			table.appendChild(before);
			table.appendChild(after);
			table.appendChild(change);
			tableDiv.appendChild(table);
			thisDiv.appendChild(tableDiv);
			
		}else{
			var sorry = document.createElement("p");
			sorry.innerHTML = "Chronicler hasn't updated with this change yet, check back in a minute or two!";
			thisDiv.appendChild(sorry); // sorry
		}
		//aaaaaand send it
		partiesDiv.appendChild(thisDiv);
	}
}

function colorFromVal(cell, val, neg){
	var cls = "eh";
	if(neg == -1){
		val = 1.25 - val; // it just works
	}
	if(val < 0.3){
		cls = "vb";
	}else if(val < 0.6){
		cls = "kb";
	}else if(val > 1.2){
		cls = "vg";
	}else if(val > 0.9){
		cls = "kg";
	}
	cell.setAttribute("class", cls);
}