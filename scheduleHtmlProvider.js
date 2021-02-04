function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    var request = new XMLHttpRequest();
    request.open('GET', '/jsxsd/xskb/xskb_list.do', false); 
    request.send(null);
    if (request.status === 200) {
      return request.responseText.replace(/[\r\n]/g,"");
    }
 
}
