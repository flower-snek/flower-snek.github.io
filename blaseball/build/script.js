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

var items = [];
var preprefixes = [],
	prefixes = [],
	postprefixes = [],
	roots = [],
	suffixes = [];
/*
way of storing modifiers:
mod --name: ___
    |
	|-adjustments
		|
		|-adjustment
		|	|
		|	|-type: 1 (stat mod)
		|	|
			|-stat: ___
			|
		|	|-min val: ___
		|	|
		|	|-max val: ___
		|
		|-another
		|	|
		|	|-type: 0 (mod mod)
		|	|
		|	|-mod: ___
		|
		|-another
			|
			|-type: 3 (dur mod)
			|
			|-dur: ___
*/


// i honestly stole this function shell off something i found on google
fetch("https://api.sibr.dev/chronicler/v2/entities?type=item")
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		//console.log(data);
		data.items.forEach((item) => {
			//console.log(item);
			//first up, preprefix (none exist rn but you never know)
			var preprefix = item.data.prePrefix;
			if(preprefix != null){
				addModifier(preprefix, preprefixes);
			}
			//there can be more than one prefix!
			var prefixess = item.data.prefixes
			for(i in prefixess){
				var prefix = prefixess[i]
				addModifier(prefix, prefixes);
			}
			//postprefix
			var postprefix = item.data.postPrefix
			if(postprefix != null){
				addModifier(postprefix, postprefixes);
			}
			//root
			var root = item.data.root
			if(root != null){
				addModifier(root, roots);
			}
			//suffix
			var suffix = item.data.suffix
			if(suffix != null){
				addModifier(suffix, suffixes);
			}
		});
		console.log("Preprefixes:");
		console.log(preprefixes);
		console.log("Prefixes:");
		console.log(prefixes);
		console.log("Postprefixes:");
		console.log(postprefixes);
		console.log("Roots:");
		console.log(roots);
		console.log("Suffixes:");
		console.log(suffixes);
		//set up the selectors!
		//preprefixes:
		preprefixesSelect = document.getElementById("preprefixes");
		//add a none to each
		var none = document.createElement("option");
		none.setAttribute("value", -1);
		preprefixesSelect.appendChild(none);
		for(i in preprefixes){
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = preprefixes[i].name;
			preprefixesSelect.appendChild(option);
		}
		//prefixes:
		//i apologize in advance for this but im bad :(
		prefixesSelect1 = document.getElementById("prefixes1");
		prefixesSelect2 = document.getElementById("prefixes2");
		var none = document.createElement("option");
		none.setAttribute("value", -1);
		var none2 = document.createElement("option");
		none2.setAttribute("value", -1);
		prefixesSelect1.appendChild(none);
		prefixesSelect2.appendChild(none2);
		for(i in prefixes){
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = prefixes[i].name;
			var option2 = document.createElement("option");
			option2.setAttribute("value", i);
			option2.innerHTML = prefixes[i].name;
			prefixesSelect1.appendChild(option);
			prefixesSelect2.appendChild(option2);
		}
		//postprefixes:
		postprefixesSelect = document.getElementById("postprefixes");
		var none = document.createElement("option");
		none.setAttribute("value", -1);
		postprefixesSelect.appendChild(none);
		for(i in postprefixes){
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = postprefixes[i].name;
			postprefixesSelect.appendChild(option);
		}
		//roots:
		rootsSelect = document.getElementById("roots");
		var none = document.createElement("option");
		none.setAttribute("value", -1);
		rootsSelect.appendChild(none);
		for(i in roots){
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = roots[i].name;
			rootsSelect.appendChild(option);
		}
		//suffixes:
		suffixesSelect = document.getElementById("suffixes");
		var none = document.createElement("option");
		none.setAttribute("value", -1);
		suffixesSelect.appendChild(none);
		for(i in suffixes){
			var option = document.createElement("option");
			option.setAttribute("value", i);
			option.innerHTML = suffixes[i].name;
			suffixesSelect.appendChild(option);
		}
	})
	.catch((err) => {
		//idk????????????????????
		console.log(err);
	});


//now for some other stuff

//helper
function addModifier(mod, list){
	//mod: the modifier object straight from the item list
	//list: preprefixes, prefixes, etc. whatever it needs to be added to
	//first, does it already exist?
	var exists = false;
	for(var i = 0; i < list.length; i++){
		if(list[i].name == mod.name){
			exists = true;
			//aight. loop through mod's adjustments and if its type 1 then do things
			mod.adjustments.forEach((adj) => {
				if(adj.type == 1){
					//find this adjustment (stat) in the list...
					for(var j = 0; j < list[i].adjustments.length; j++){
						if(list[i].adjustments[j].stat == adj.stat){
							if(list[i].adjustments[j].min > adj.value){
								list[i].adjustments[j].min = adj.value;
							}
							if(list[i].adjustments[j].max < adj.value){
								list[i].adjustments[j].max = adj.value;
							}
						}
					}
				}
			});
			//i dont think there's any example where a stat change doesn't always appear when a modifier is present so i dont have to worry about that i hope
		}
	}
	//console.log(mod);
	if(!exists){
		//add it, except we handle type=1 differently so just recreate it im lazy
		newMod = {};
		newMod.name = mod.name;
		newMod.adjustments = [];
		mod.adjustments.forEach((adj) => {
			adjustment = {}
			adjustment.type = adj.type;
			if(adj.type == 0){
				adjustment.mod = adj.mod;
			}else if(adj.type == 1){
				adjustment.stat = adj.stat;
				adjustment.min = adj.value;
				adjustment.max = adj.value;
			}else if(adj.type == 3){
				adjustment.dur = adj.value;
			} // ok seriously what is type 2 we have 0 1 and 3 i swear game band is just trolling us at this point
			newMod.adjustments.push(adjustment);
		});
		list.push(newMod);
		//console.log(newMod);
		//console.log(list);
	}
}


function createItem(){
	//alright time to collect the stats
	var name = "";
	var dur = 0;
	var hasRoot = false;
	var adj = [];
	//store each adjustment here!
	//first the preprefix
	//i have a better idea for the naming to make this more copy-pasteable and less readable
	thisSelect = document.getElementById("preprefixes");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		name = name + preprefixes[thisSelect.value].name + " ";
		thisAdj = preprefixes[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type = 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type = 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	//prefix1
	thisSelect = document.getElementById("prefixes1");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		name = name + prefixes[thisSelect.value].name + " ";
		thisAdj = prefixes[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type == 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type == 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	//prefix2
	thisSelect = document.getElementById("prefixes2");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		name = name + prefixes[thisSelect.value].name + " ";
		thisAdj = prefixes[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type == 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type == 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	//postprefix
	thisSelect = document.getElementById("postprefixes");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		name = name + postprefixes[thisSelect.value].name + " ";
		thisAdj = postprefixes[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type == 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type == 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	//root
	thisSelect = document.getElementById("roots");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		hasRoot = true;
		name = name + roots[thisSelect.value].name;
		thisAdj = roots[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type == 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type == 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	//suffix
	thisSelect = document.getElementById("suffixes");
	console.log(thisSelect.value);
	if(thisSelect.value != -1){
		dur++;
		name = name + " of " + suffixes[thisSelect.value].name;
		thisAdj = suffixes[thisSelect.value].adjustments;
		for(i in thisAdj){
			var exists = false;
			for(j in adj){
				if(thisAdj[i].type == adj[j].type && thisAdj[i].stat == adj[j].stat){
					exists = true;
					if(thisAdj[i].type == 1){
						adj[j].min += thisAdj[i].min;
						adj[j].max += thisAdj[i].max;
					}
					if(thisAdj[i].type == 3){
						adj[j].dur += thisAdj[i].dur;
					}
				}
			}
			if(!exists){
				adj.push(thisAdj[i]);
			}
		}
	}
	console.log(adj);
	console.log("Created!");
	//now show the item if there is a root:
	header = document.getElementById("itemheader");
	if(hasRoot){
		header.innerHTML = name;
		stats = document.getElementById("itemstats");
		stats.innerHTML = "";
		for(i in adj){
			var thisStat = document.createElement("p");
			if(adj[i].type == 0){
				thisStat.innerHTML = "Adds mod " + adj[i].mod;
				stats.appendChild(thisStat);
			}else if(adj[i].type == 1){
				thisStat.innerHTML = FK_STATS[adj[i].stat] + ": " + adj[i].min.toFixed(2) + " to " + adj[i].max.toFixed(2);
				stats.appendChild(thisStat);
			}else if(adj[i].type == 3){
				dur += adj[i].dur;
			}
		}
		var durability = document.createElement("p");
		durability.innerHTML = dur + " durability";
		stats.appendChild(durability);
	}else{
		header.innerHTML = "A root is required (the one before the \"of\")";
	}
}

function randomItem(){
	var preprefixess = document.getElementById("preprefixes");
	if(preprefixes.length > 0){
		if(Math.random() > 0.5){
			preprefixess.value = Math.floor(preprefixes.length * Math.random());
		}else{
			preprefixess.value = -1;
		}
	}else{
		preprefixess.value = -1;
	}
	var prefixes1s = document.getElementById("prefixes1");
	if(Math.random() > 0.5){
		prefixes1s.value = Math.floor(prefixes.length * Math.random());
	}else{
		prefixes1s.value = -1;
	}
	var prefixes2s = document.getElementById("prefixes2");
	if(Math.random() > 0.5){
		prefixes2s.value = Math.floor(prefixes.length * Math.random());
	}else{
		prefixes2s.value = -1;
	}
	var postprefixess = document.getElementById("postprefixes");
	if(Math.random() > 0.5){
		postprefixess.value = Math.floor(postprefixes.length * Math.random());
	}else{
		postprefixess.value = -1;
	}
	var rootss = document.getElementById("roots");
	rootss.value = Math.floor(roots.length * Math.random());
	if(rootss.value == -1){
		rootss.value = 1; // i dont care
	}
	var suffixess = document.getElementById("suffixes");
	if(Math.random() > 0.5){
		suffixess.value = Math.floor(suffixes.length * Math.random());
	}else{
		suffixess.value = -1;
	}

	createItem();
}