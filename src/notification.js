document.addEventListener('DOMContentLoaded',function(e) {
  document.location.hash.substr(1).split('&').forEach(function(nameval) {
    nameval = nameval.split('=');
    document.getElementById(nameval[0])[nameval[0]==='image' ? 'src' : 'innerHTML'] = decodeURIComponent(nameval[1]);
  });
  document.body.addEventListener('click', function(e) {
    e.preventDefault();
    // Links inside notifications aren't handlded by Chrome. To make them work, catch
    // the clicks manually and open using window.open()
    if (e.target.tagName === 'A') { // When a link is clicked, use its href
      var href = e.target.getAttribute('href');
    // Clicking in the notification area, but not on a specific link, opens the first
    // link in the content area, which is the primary link.
    } else {
      var href = document.querySelector('#content a').href;
    }
    window.open(href.indexOf('/') === 0 ? 'https://github.com' + href : href);
    window.close();
  }, false);
});