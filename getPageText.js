chrome.runtime.sendMessage({
    topic: "pageText",
    text: jQuery("html").text()
})