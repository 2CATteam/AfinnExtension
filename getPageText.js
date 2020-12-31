var ownjQuery = $.noConflict()
var toSend = ""

console.log(window.getSelection().toString())

if (window.getSelection().toString()) {
    chrome.runtime.sendMessage({
        topic: "pageText",
        text: window.getSelection().toString(),
        selection: true
    })
} else {
    chrome.runtime.sendMessage({
        topic: "pageText",
        text: ownjQuery("body")[0].innerText,
        selection: false
    })
}