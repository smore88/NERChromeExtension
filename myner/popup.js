/*
    When we click the highlightTextButton in the popup.html, the popup.js is listening to that trigger
    and then it will send a message to the background.js of clickedHighlightTextButton and the tab
    that we are currently on.
*/

$(document).ready(function() {
    $('#highlightTextButton').click(function() {
        chrome.tabs.query({ active: true, currentWindow : true}, function(tabs) {
            console.log('clicked highlightTextButton; now going to background.js');
            chrome.runtime.sendMessage({ message: "clickedHighlightTextButton", tabId: tabs[0].id });
        });
    });
});

