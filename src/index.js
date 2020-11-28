import './styles/index.scss'

// код для работы селекта

const selectListener = (__select) => {
  const selectSingle_title = __select.querySelector('.__select__title')
  const selectSingle_labels = __select.querySelectorAll('.__select__label')

  // Toggle menu
  selectSingle_title.addEventListener('click', () => {
    if ('active' === __select.getAttribute('data-state')) {
      __select.setAttribute('data-state', '')
    } else {
      __select.setAttribute('data-state', 'active')
    }
  })

  // Close when click to option
  for (let i = 0; i < selectSingle_labels.length; i++) {
    selectSingle_labels[i].addEventListener('click', (evt) => {
      selectSingle_title.textContent = evt.target.textContent
      __select.setAttribute('data-state', '')
    })
  }
}

const selectSingleFooter = document.querySelector('#__select-footer')
const selectSinglePostsSort = document.querySelector('#__select-posts-sort')

selectListener(selectSingleFooter)
if (selectSinglePostsSort) {
  selectListener(selectSinglePostsSort)
}
