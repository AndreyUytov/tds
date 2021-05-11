let ruleForBlockBackButton = /order/
let pathName = document.location.pathname
if (ruleForBlockBackButton.test(pathName)) {
  history.pushState(null, null, location.href);
  window.onpopstate = function() {
    history.go(1);
  };
}

