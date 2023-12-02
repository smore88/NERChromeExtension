/*
When we click the extractTextButton in the popup.html, we are listening to that trigger
and we are sending a message to the background.js of clickedExtractButton and the tab
that we are currently on.
*/
$(document).ready(function() {
    $('#extractTextButton').click(function() {
        chrome.tabs.query({ active: true, currentWindow : true}, function(tabs) {
            console.log('sending clickedExtractButton to background.js');
            chrome.runtime.sendMessage({ message: "clickedExtractButton", tabId: tabs[0].id });
        });
    });
});

