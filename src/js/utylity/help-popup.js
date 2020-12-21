const snapHelp = document.querySelector('.snap-help')
const popupHelp = document.querySelector('.help-popup__wrapper')

if (snapHelp && popupHelp) {
  snapHelp.onclick = () => {
    popupHelp.style.display = 'flex'
    snapHelp.style.display = 'none'
    document.body.style.width =
      document.body.getBoundingClientRect().width + 'px'
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
