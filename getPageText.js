var ownjQuery = $.noConflict()
var toSend = ""

chrome.runtime.sendMessage({
    topic: "pageText",
    text: ownjQuery("body")[0].innerText
})