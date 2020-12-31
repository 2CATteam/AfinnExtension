chrome.runtime.onMessage.addListener(function(request, sender) {
	if(request.topic == "pageText") {
		message.innerText = request.text;
	}
});

function onWindowLoad() {
	var message = document.querySelector('#message');
	chrome.tabs.executeScript(null, {
		file: "getPageText.js"
	}, function() {
		if (chrome.runtime.lastError) {
			message.innerText = "Error! Problem injecting script: \n" + chrome.runtime.lastError.message;
		}
	});
}

window.onload = onWindowLoad; 