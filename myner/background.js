chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension Installed');
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "clickedExtractButton") {
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


        // Now, you can send the extracted text to your server or perform other actions
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
        // Check if the server response is successful
        if (data.success) {
            // Send the extracted entities to the content script and the content script will performing all the highlighting
            chrome.tabs.sendMessage(tabId, { action: "highlightEntities", tagEntitiesArr : data.data.entities });
        } else {
            console.error('Error processing the text on the server');
        }
    })
    .catch(error => {
        console.error('Error sending data to server:', error);
    });
}


// Listen for the response from content script
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.message === "textExtracted") {
//         var extractedText = request.text;
//         console.log("we have extracted the text from the webpage and ready to send to server");

//         // Now, you can send the extracted text to your server or perform other actions
//         sendTextToServer(extractedText, sender.tab.id);
//     }
// });

// function sendTextToServer(text, tabId) {
//     fetch('http://127.0.0.1:8000/myner/receive_webpage_contents/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: text }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Server response:', data);
//         // Check if the server response is successful
//         if (data.success) {
//             // Send the extracted entities to the content script
//             // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//                 chrome.tabs.sendMessage(tabId, { action: "highlightEntities", entities: data.data.entities });
//             // });
//         } else {
//             console.error('Error processing the text on the server');
//         }
//     })
//     .catch(error => {
//         console.error('Error sending data to server:', error);
//     });
// }

// Check if the server response is successful
        // if (data.success) {
        //     // Send the extracted entities to the content script
        //     // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     chrome.tabs.sendMessage(tabId, { action: "highlightEntities", entities: data.data.extractedTagText });
        //     // });
        // } else {
        //     console.error('Error processing the text on the server');
        // }