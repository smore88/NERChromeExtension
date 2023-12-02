chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "extractText") {
        console.log("content.js will now extract the text and send to background.js");
        var extractedText = extractText();
        chrome.runtime.sendMessage({ message: "textExtracted", text: extractedText });
    }
});

function extractText() {
    var extractedText = [];
    for (var node of document.querySelectorAll('*')) {
        if(node.nodeType === 1 && node.textContent.trim()) {
            extractedText.push({'tag' : node.tagName, 'text' : node.textContent});
        }
    }
    return extractedText;
}

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         // Perform the highlighting logic here
//         if (request.action === "highlightEntities") {
//             console.log("we got the entities are now we are in the content.js about to higlight")
//             const tagEntitiesArr = request.tagEntitiesArr; // keep the original
//             const entry = tagEntitiesArr[0];
//             console.log(entry);

//             const currTag = entry.tag;
//             const entities = entry.textEntities;

//             const tagType = document.querySelectorAll(currTag);
//             for (const tType of tagType) {
//                 var currTextInTag = tType.textContent;
//                 let currTextCpy = currTextInTag;
//                 console.log(currTextInTag);

//                 let newText = ""

//                 if(foundAllEntities(entities, currTextInTag) === true) { // if we found all the named entities in the current tType then lets highlight here

//                     // 1. find all my intervals of highlighted and non-highlighted substring sections
//                     const segments = findAllSegments(entities, currTextInTag.length, currTextInTag)

//                     // console.log(segments);

//                     for(const segment of segments) {
//                         const firstChar = segment.firstChar;
//                         const lastChar = segment.lastChar;
//                         const highlighted = segment.highlighted;
//                         const toHighlight = segment.toHighlight;
//                         const type = segment.type;

//                         if(highlighted == false) { // this means its a not highlighted to just append
//                             newText += currTextInTag.substring(firstChar, lastChar);
//                         } else if(highlighted == true) {
//                             const styledSpan = createStyledSpan(toHighlight, type);
//                             newText += styledSpan.outerHTML;
//                         }
//                     }
//                     tType.innerHTML = newText;
//                     break;
//                 }
//             }
//             console.log("finished higlighting the webpage all done")
//         }
//     }
// );

function findAllSegments(entities, textLen, currTextInTag) {
    let segments = [];
    let tempPosition = 0;
    for(let i = 0; i < entities.length; i++) {
        const start = entities[i].start;
        const end = entities[i].end;

        if(start > tempPosition) {
            segments.push({firstChar: tempPosition, lastChar: start, highlighted: false, toHighlight: "", type: ""});
        }
        segments.push({firstChar: start, lastChar: end, highlighted: true, toHighlight: currTextInTag.substring(start, end), type: entities[i].label});
        tempPosition = end;
    }
    if(tempPosition < textLen) {
        segments.push({firstChar: tempPosition, lastChar: textLen, highlighted: false, toHighlight: "", type: ""});
    }

    return segments;
}

function foundAllEntities(entities, currTextInTag) {
    for(let i = 0; i < entities.length; i++) {
        console.log({ text: entities[i].text, substring: currTextInTag.substring(entities[i].start, entities[i].end)});
        if(currTextInTag.substring(entities[i].start, entities[i].end) !== entities[i].text) {
            return false;
        }
    }
    return true;
}

function createStyledSpan(textToHighlight, entityType) {
    let backgroundColor, textColor;

    if (entityType == "DATE") {
        backgroundColor = 'green';
        textColor = 'black';
    } else if (entityType == "ORG") {
        backgroundColor = 'lightgray';
        textColor = 'black';
    } else {
        backgroundColor = 'yellow';
        textColor = 'black';
    }

    const styledSpan = document.createElement('span');
    styledSpan.style.backgroundColor = backgroundColor;
    styledSpan.style.color = textColor;
    styledSpan.textContent = textToHighlight;

    return styledSpan;
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Perform the highlighting logic here
        if (request.action === "highlightEntities") {
            console.log("we got the entities are now we are in the content.js about to higlight")
            const tagEntitiesArr = request.tagEntitiesArr; // keep the original
            // const tagEntitiesArrCopy = tagEntitiesArr; // edit the copy
            console.log(tagEntitiesArr);

            for(let entry of tagEntitiesArr) { // go through each entry
                // each entry has two pieces tag and text-entities
                const currTag = entry.tag;
                const entities = entry.textEntities;

                const tagType = document.querySelectorAll(currTag);
                for (const tType of tagType) {
                    var currTextInTag = tType.textContent;
                    let currTextCpy = currTextInTag;
                    console.log(currTextInTag);

                    let newText = ""

                    if(foundAllEntities(entities, currTextInTag) === true) { // if we found all the named entities in the current tType then lets highlight here

                        // 1. find all my intervals of highlighted and non-highlighted substring sections
                        const segments = findAllSegments(entities, currTextInTag.length, currTextInTag)

                        // console.log(segments);

                        for(const segment of segments) {
                            const firstChar = segment.firstChar;
                            const lastChar = segment.lastChar;
                            const highlighted = segment.highlighted;
                            const toHighlight = segment.toHighlight;
                            const type = segment.type;

                            if(highlighted == false) { // this means its a not highlighted to just append
                                newText += currTextInTag.substring(firstChar, lastChar);
                            } else if(highlighted == true) {
                                const styledSpan = createStyledSpan(toHighlight, type);
                                newText += styledSpan.outerHTML;
                            }
                        }
                        tType.innerHTML = newText;
                        break;
                    }
                }
            }
            console.log("finished higlighting the webpage all done")
        }
    }
);