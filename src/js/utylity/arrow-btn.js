const arrowSnap = document.querySelector('.arrow-scroll-snap')

arrowSnap.onclick = function() {
  window.scrollTo(pageXOffset, 0);
};

window.addEventListener('scroll', function() {
  arrowSnap.style.display = (pageYOffset < document.documentElement.clientHeight) ? 'none' : 'flex';
});


// tooltip

let tooltip;

    document.onmouseover = function(event) {
      let anchorElem = event.target.closest('.list-section__item-column');

      if (!anchorElem) return;

      tooltip = showTooltip(anchorElem, anchorElem.textContent);
    }

    document.onmouseout = function() {
      if (tooltip) {
        tooltip.remove();
        tooltip = false;
      }

    }


    function showTooltip(anchorElem, text) {
      let tooltipElem = document.createElement('div');
      tooltipElem.className = 'tooltip';
      tooltipElem.textContent = text;
      document.body.append(tooltipElem);

      let coords = anchorElem.getBoundingClientRect();

      let left = coords.left + (anchorElem.offsetWidth - tooltipElem.offsetWidth) / 2;
      if (left < 0) left = 0;

      let top = coords.top - tooltipElem.offsetHeight - 5;
      if (top < 0) {
        top = coords.top + anchorElem.offsetHeight + 5;
      }

      tooltipElem.style.left = left + 'px';
      tooltipElem.style.top = top + 'px';

      return tooltipElem;
    }