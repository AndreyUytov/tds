const snapHelp = document.querySelector('.snap-help')
const popupHelp = document.querySelector('.help-popup__wrapper')

if (snapHelp && popupHelp) {
  let bodyWidth = document.body.getBoundingClientRect().width
  snapHelp.onclick = () => {
    popupHelp.style.display = 'flex'
    snapHelp.style.display = 'none'
    document.body.style.width = bodyWidth + 'px'
    document.body.style.overflow = 'hidden'
  }
  const closeSnap = popupHelp.querySelector('.help-popup__close-snap')
  closeSnap.onclick = () => {
    popupHelp.style.display = ''
    snapHelp.style.display = ''
    document.body.style.overflow = ''
    document.body.style.width = ''
  }
}
