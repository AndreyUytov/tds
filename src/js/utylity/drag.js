const dragList = document.querySelector('#drag-list')

if (dragList) {
  const children = Array.from(dragList.children)
  let childrenPos = []

  children.forEach((elem) => {
    elem.addEventListener('transitionend', (evt) => {
      evt.target.classList.remove('animate-on-transforms')
    })
  })

  function measureStartPos() {
    childrenPos = children.map((el) => {
      return {
        start: el.getBoundingClientRect().top,
      }
    })
  }

  function measureEndPosAndInvert() {
    children.forEach((elem, i) => {
      childrenPos[i].end = elem.getBoundingClientRect().top
      elem.style.transform = `translateY(${
        childrenPos[i].start - childrenPos[i].end
      }px)`

      requestAnimationFrame(function () {
        elem.classList.add('animate-on-transforms')
        elem.style.transform = ''
      })
    })
  }

  let currentDroppable = null

  dragList.addEventListener('pointerdown', (evt) => {
    evt.preventDefault()

    function moveAt(x, y) {
      clone.style.left = x - shiftX + 'px'
      clone.style.top = y - shiftY + 'px'
    }

    let target = evt.target.closest('.drag-test__item-wrapper')
    if (!target) return

    let shiftY = evt.clientY - target.getBoundingClientRect().top
    let shiftX = evt.clientX - target.getBoundingClientRect().left

    const clone = target.firstElementChild.cloneNode(true)

    target.style.opacity = '0'

    clone.style.position = 'fixed'
    clone.style.width =
      target.firstElementChild.getBoundingClientRect().width + 'px'
    clone.style.height =
      target.firstElementChild.getBoundingClientRect().height + 'px'
    clone.style.zIndex = 1000
    clone.style.color = '#fff'
    document.body.append(clone)

    moveAt(evt.clientX, evt.clientY)

    let timer

    function onPointerMove(evt) {
      moveAt(evt.clientX, evt.clientY)

      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        clone.classList.add('visually-hidden')
        let elemBelow = document.elementFromPoint(evt.clientX, evt.clientY)
        clone.classList.remove('visually-hidden')

        if (!elemBelow) return

        let droppableBelow = elemBelow.closest('.drag-test__item-wrapper')

        if (currentDroppable != droppableBelow) {
          currentDroppable = droppableBelow
          if (currentDroppable) {
            if (currentDroppable === target) return
            if (currentDroppable === droppableBelow) {
              let currentItem = children.find((el) => el === target)
              let currentDroppableItem = children.find(
                (el) => el === currentDroppable
              )

              let topDroppable = currentDroppable.getBoundingClientRect().top
              let heigthDroppable =
                currentDroppable.getBoundingClientRect().height
              let middleHeight = heigthDroppable / 2 + topDroppable
              if (evt.clientY >= middleHeight) {
                measureStartPos()
                currentDroppableItem.after(currentItem)
                measureEndPosAndInvert()
              } else {
                measureStartPos()
                currentDroppableItem.before(currentItem)
                measureEndPosAndInvert()
              }
            }
          }
        } else {
          if (currentDroppable) {
            if (currentDroppable === target) return
            if (currentDroppable === droppableBelow) {
              let currentItem = children.find((el) => el === target)
              let currentDroppableItem = children.find(
                (el) => el === currentDroppable
              )

              let topDroppable = currentDroppable.getBoundingClientRect().top
              let heigthDroppable =
                currentDroppable.getBoundingClientRect().height
              let middleHeight = heigthDroppable / 2 + topDroppable
              if (evt.clientY >= middleHeight) {
                measureStartPos()
                currentDroppableItem.after(currentItem)
                measureEndPosAndInvert()
              } else {
                measureStartPos()
                currentDroppableItem.before(currentItem)
                measureEndPosAndInvert()
              }
            }
          }
        }
      }, 50)
    }

    function onPointerUp() {
      clone.style.position = 'fixed'
      clone.classList.add('animate-on-transforms')
      clone.style.top = target.getBoundingClientRect().top + 'px'
      clone.style.left = target.getBoundingClientRect().left + 'px'

      clone.addEventListener('transitionend', (evt) => {
        clone.remove()
        target.style.opacity = ''
      })
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)

    document.addEventListener('pointerup', onPointerUp)
  })
}
