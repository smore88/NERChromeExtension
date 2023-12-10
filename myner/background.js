chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clickedHighlightTextButton") {
            console.log("we are inside the background.js and we now will ask content.js to extract text ");

            var tabId = request.tabId;
            chrome.tabs.sendMessage(tabId, { message: "extractText" });
        }
    }
);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "textExtracted") {
        var extractedTagText = request.text;
        console.log(extractedTagText);
        console.log("we have extracted the text from the webpage and ready to send to server");
        sendToServer(extractedTagText, sender.tab.id);
    }
});

function sendToServer(extractedTagText, tabId) {
    fetch('http://127.0.0.1:8000/myner/receive_webpage_contents/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ extractedTagText : extractedTagText }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        if (data.success) {
            // Send the extracted entities to the content.js that will highlight everything
            chrome.tabs.sendMessage(tabId, { action: "highlightEntities", tagEntitiesArr : data.data.entities });
        } else {
            console.error('Error processing the text on the server');
        }
    })
    .catch(error => {
        console.error('Error sending data to server:', error);
    });
}