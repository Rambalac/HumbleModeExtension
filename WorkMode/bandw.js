var imageurl = chrome.extension.getURL("dummy.png");

function replaceOtherImages(tag) {
    var style = tag.style;
    style.backgroundImage = "";
}

function replaceImages(tag) {
    if (tag.src !== "" && tag.src !== undefined && tag.src !== imageurl) {
        tag.src = imageurl;
    }
    if (tag.srcset !== "" && tag.srcset !== undefined && tag.srcset !== imageurl) {
        tag.srcset = imageurl;
    }
    if (tag['data-src'] !== "" && tag['data-src'] !== undefined) {
        tag['data-src'] = "";
        tag.src = imageurl;
    }
}

function processArray(tags, func) {
    for (var i = 0, len = tags.length; i < len; i++) func(tags[i])
}

function checkTag(node) {
    if (node.nodeType !== 1) return;
    if (node.tagName === "SCRIPT") return;
    if (node.tagName === "META") return;

    replaceImages(node)
    processArray(document.getElementsByTagName("img"), replaceImages);

    replaceOtherImages(node);
    processArray(document.getElementsByTagName("*"), replaceOtherImages);
}

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        replaceImages(mutation.target);
    });
});


function workmodeon(reallydo) {
    if (reallydo !== true) return;
    var body = document.getElementsByTagName('body')[0];
    body.className += " ___body_desaturated___";
    checkTag(document);
    body.addEventListener("DOMNodeInserted", function (evt) {
        checkTag(evt.target);
        
        var node = evt.target;
        if (node.nodeType !== 1) return;
        if (node.tagName === "SCRIPT") return;
        if (node.tagName === "META") return;

        observer.observe(evt.target, { attributes: true, subtree: true, attributeFilter: ["src", "srcset", "data-src"] });

    }, false);
}
function workmodeoff() {
    window.location.reload();
}

chrome.runtime.sendMessage({}, workmodeon);