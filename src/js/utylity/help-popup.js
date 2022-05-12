import {
  animate,
  qubic,
  makeToZero,
  setupEndValue,
  makeEaseOut,
} from './animate'

const snapHelp = document.querySelector('.snap-help')
const popupHelp = document.querySelector('.help-popup__wrapper')

if (snapHelp && popupHelp) {
  snapHelp.onclick = () => {
    popupHelp.style.display = 'flex'
    popupHelp.style.transform = 'translateX(300%)'
    animate({
      timing: makeToZero(qubic),
      duration: 400,
      draw: (progress) => {
        popupHelp.style.transform = `translateX(${setupEndValue(
          300,
          0,
          progress
        )}%)`
      },
    })
    snapHelp.style.display = 'none'
    document.body.style.width =
      document.body.getBoundingClientRect().width + 'px'
    document.body.style.overflow = 'hidden'
  }
  const closeSnap = popupHelp.querySelector('.help-popup__close-snap')
  closeSnap.onclick = () => {
    animate({
      timing: qubic,
      duration: 400,
      draw: (progress) => {
        popupHelp.style.transform = `translateX(${progress * 300}%)`
      },
    }).then(() => {
      popupHelp.style.display = ''
      snapHelp.style.display = ''
      document.body.style.overflow = ''
      document.body.style.width = ''
    })
  }
}

let topScrollBtn = document.querySelector('.snap-help--top')
if (topScrollBtn) {
  window.addEventListener('scroll', function () {
    topScrollBtn.style.display =
      pageYOffset < document.documentElement.clientHeight ? 'none' : 'flex'
  })
  topScrollBtn.onclick = function () {
    animate({
      duration: 400,
      timing: qubic,
      draw(progress) {
        window.scrollTo(
          pageXOffset,
          `${setupEndValue(0, pageYOffset, progress)}`
        )
      },
    })
  }
}
