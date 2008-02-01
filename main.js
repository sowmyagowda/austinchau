  function createIframe (iframeName, url, width, height) {

    var iframe;

    if (document.createElement && (iframe =
    document.createElement('iframe'))) {
      iframe.name = iframe.id = iframeName;
      iframe.width = width;
      iframe.height = height;
      iframe.src = url; //'about:blank';
      document.body.appendChild(iframe);
    }
/*
    if (iframe) {
      var iframeDoc;
      if (iframe.contentDocument) {
        iframeDoc = iframe.contentDocument;
      } else if (iframe.contentWindow) {
        iframeDoc = iframe.contentWindow.document;
      } else if (window.frames[iframe.name]) {
        iframeDoc = window.frames[iframe.name].document;
      }
            
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write('<html><body><p>First iframe.<\/p><\/body><\/html>');
        iframeDoc.close();
      }
    }
*/
    return iframe;
  }
