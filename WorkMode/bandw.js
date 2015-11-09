var imageurl = chrome.extension.getURL("dummy.png");

function processArray(tags, func) {
  for (var i = 0, len = tags.length; i < len; i++) func(tags[i])
}

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

  if (tag['data-src'] !== "" && tag['data-src'] !== undefined && tag.src !== imageurl) {
    tag['data-src'] = "";
    tag.src = imageurl;
  }
}

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    replaceImages(mutation.target);
  });
});


function applyToDocument() {
  var body = document.getElementsByTagName('body')[0];
  body.className += " ___body_desaturated___";

  processArray(document.getElementsByTagName("img"), replaceImages);
}

function applyWorkMode(tabid) {
  window.addEventListener('DOMContentLoaded', applyToDocument, false);
  observer.observe(document, { attributes: true, subtree: true, attributeFilter: ["src", "srcset", "data-src"] });
}

chrome.runtime.sendMessage({}, applyWorkMode);