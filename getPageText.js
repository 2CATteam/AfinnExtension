var ownjQuery = $.noConflict()
chrome.runtime.sendMessage({
    topic: "pageText",
    text: ownjQuery("html").text()
})