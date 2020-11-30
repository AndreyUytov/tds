import './styles/index.scss'

// код для работы селекта

// const selectListener = (__select) => {
//   const selectSingle_title = __select.querySelector('.__select__title')
//   const selectSingle_labels = __select.querySelectorAll('.__select__label')

//   // Toggle menu
//   selectSingle_title.addEventListener('click', () => {
//     if ('active' === __select.getAttribute('data-state')) {
//       __select.setAttribute('data-state', '')
//     } else {
//       __select.setAttribute('data-state', 'active')
//     }
//   })

//   // Close when click to option
//   for (let i = 0; i < selectSingle_labels.length; i++) {
//     selectSingle_labels[i].addEventListener('click', (evt) => {
//       selectSingle_title.textContent = evt.target.textContent
//       __select.setAttribute('data-state', '')
//     })
//   }
// }

// const selectSingleFooter = document.querySelector('#__select-footer')
// const selectSinglePostsSort = document.querySelector('#__select-posts-sort')

// selectListener(selectSingleFooter)
// if (selectSinglePostsSort) {
//   selectListener(selectSinglePostsSort)
// }

// dranDrop

const dragList = document.querySelector('.drag__list')
let dragNdropTimer = null

if (dragList) {
  dragList.addEventListener('pointerdown', (evt) => {
    let target = evt.target.closest('.drag__elem')
    const targetContainer = evt.target.closest('.drag__container')
    let widthTarget = target.offsetWidth
    dragNdropTimer = setTimeout(() => {
      let shiftY = evt.clientY - target.getBoundingClientRect().top

      targetContainer.style.border = '1px solid #406583'

      target.style.width = widthTarget + 'px'
      target.style.position = 'absolute'
      target.style.zIndex = 1000
      document.body.append(target)

      moveAt(evt.pageY)

      function moveAt(pageY) {
        target.style.top = pageY - shiftY + 'px'
      }

      let currentClosestContainer = null

      const onPointerMove = (evt) => {
        moveAt(evt.pageY)

        target.hidden = true
        let elemUnderPointer = document.elementFromPoint(
          evt.clientX,
          evt.clientY
        )
        target.hidden = false

        if (!elemUnderPointer) return

        let closestContainer = elemUnderPointer.closest('.drag__container')

        if (currentClosestContainer != closestContainer) {
          if (currentClosestContainer) {
            currentClosestContainer.style.border = ''
          }
          currentClosestContainer = closestContainer
          if (currentClosestContainer) {
            currentClosestContainer.style.border = '1px solid #13B915'
          }
        }
      }

      const onPointerUp = (evt) => {
        target.style.position = ''
        target.style.top = ''
        target.style.zIndex = ''
        target.style.width = ''
        targetContainer.style.border = ''

        if (currentClosestContainer) {
          currentClosestContainer.style.border = ''
          let currentDragElem = currentClosestContainer.querySelector(
            '.drag__elem'
          )
          targetContainer.append(currentDragElem)
          currentClosestContainer.append(target)
        } else {
          targetContainer.append(target)
        }

        document.removeEventListener('pointermove', onPointerMove)
        target.removeEventListener('pointerup', onPointerUp)
      }

      document.addEventListener('pointermove', onPointerMove)

      target.addEventListener('pointerup', onPointerUp)
    }, 300)
  })
}
