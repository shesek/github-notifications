document.addEventListener('DOMContentLoaded',function(e) {
  document.getElementById('interval').value = localStorage.interval / 1000;
  document.getElementById('display-time').value = localStorage.displayTime / 1000;
  document.getElementsByTagName('form')[0].addEventListener('submit', function() {
    localStorage.interval = (parseInt(document.getElementById('interval').value) || 120) * 1000;
    localStorage.displayTime = (parseInt(document.getElementById('display-time').value) || 15) * 1000;
    document.getElementById('message').style.display = 'block';
    e.preventDefault();
    return false;
  }, false);
});
