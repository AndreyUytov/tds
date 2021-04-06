const arrowSnap = document.querySelector('.arrow-scroll-snap')

arrowSnap.onclick = function () {
  window.scrollTo(pageXOffset, 0)
}

window.addEventListener('scroll', function () {
  arrowSnap.style.display =
    pageYOffset < document.documentElement.clientHeight ? 'none' : 'flex'
})

// select animation

const adminForm = document.querySelector('.admin-page__filters-form')

adminForm.addEventListener('click', (evt) => {
  let select = evt.target.closest('.filters-form__select-wrapper')
  if (!select) return

  select.classList.toggle('filters-form__select-wrapper--open')
})
