const arrowSnap = document.querySelector('.arrow-scroll-snap')

arrowSnap.onclick = function () {
  window.scrollTo(pageXOffset, 0)
}

window.addEventListener('scroll', function () {
  arrowSnap.style.display =
    pageYOffset < document.documentElement.clientHeight ? 'none' : 'flex'
})

// select animation

const selectsWrappers = document.querySelectorAll(
  '.filters-form__select-wrapper'
)

document.addEventListener('click', (evt) => {
  let select = evt.target.closest('.filters-form__select-wrapper')
  if (!select) {
    selectsWrappers.forEach((el) => {
      el.classList.remove('filters-form__select-wrapper--open')
    })
    return
  }

  select.classList.toggle('filters-form__select-wrapper--open')
})
