chrome.runtime.onMessage.addListener(function(request, sender) {
	if(request.topic == "pageText") {
		var result = analyze(request.text)
		document.getElementById("score").innerHTML = result.sum
		document.getElementById("words").innerHTML = "With " + result.words + " words"
		document.getElementById("average").innerHTML = Math.round(result.sum / result.words * 1000) / 1000
		if(result.sum > 0) {
			document.getElementById("score").style.color = "Green"
			document.getElementById("average").style.color = "Green"
		}
		else if( result.sum < 0) {
			document.getElementById("score").style.color = "Red"
			document.getElementById("average").style.color = "Red"
		}
		else {
			document.getElementById("score").style.color = "DimGrey"
			document.getElementById("average").style.color = "DimGrey"
		}
	}
});

function onWindowLoad() {
	var message = document.querySelector('#message');
	chrome.tabs.executeScript(null, {
		file: "jquery-3.5.1.min.js"
	}, function() {
		if (chrome.runtime.lastError) {
			message.innerText = "Error! Problem injecting jQuery: \n" + chrome.runtime.lastError.message;
		}
	});
	chrome.tabs.executeScript(null, {
		file: "getPageText.js"
	}, function() {
		if (chrome.runtime.lastError) {
			message.innerText = "Error! Problem injecting script: \n" + chrome.runtime.lastError.message;
		}
	});
}

window.onload = onWindowLoad; 


function analyze(string) {
	//Initialize cumulative score
	var scoreSum = 0
	//Split into words
	var arr = string.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').split(/\s/)
	//Look at each word in array
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == "constructor" || arr[i] == "__proto__" || arr[i] == "__noSuchMethod__") {
			continue
		}
		//If special case where we need to look ahead
		if (afinn["lookahead"][arr[i]]) {
			//If we can look ahead and we see one of the special words
			if (i + 1 < arr.length && afinn["lookahead"][arr[i]][arr[i + 1]]) {
				//If we can look ahead and there's a third word
				if (i + 2 < arr.length && afinn["lookahead"][arr[i]][arr[i + 1]]["then"]) {
					//If the third word is right
					if (afinn["lookahead"][arr[i]][arr[i + 1]]["then"] == arr[i + 2]) {
						//Add the correct value
						scoreSum += afinn["lookahead"][arr[i]][arr[i + 1]]["value"]
						console.log(arr[i])
						//Skip the two words we just looked at
						i = i + 2
					}
				//If there isn't a third word
				} else {
					//Add the correct value
					scoreSum += afinn["lookahead"][arr[i]][arr[i + 1]]["value"]
					console.log(arr[i])
					//Skip the word we just looked at
					i++
				}
			//If we don't see the word we're looking ahead for, fall back to simple check below.
			} else if (afinn["simple"][arr[i]]) {
				scoreSum += afinn["simple"][arr[i]]
				console.log(arr[i])
			}
		//If this word is in the list, add the associated value
		} else if (afinn["simple"][arr[i]]) {
			scoreSum += afinn["simple"][arr[i]]
		}
	}
	console.log(scoreSum)
	//Return proper values
	return {"sum": scoreSum, "words": arr.length}
}