import css from './style.scss'

customElements.define(
  'verbal-form',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
      this.btn = this.shadowRoot.querySelector('.btn')
      this.list = this.shadowRoot.querySelector('.verbal-list')
      this.labels = []

      this.btn.addEventListener('click', (evt) => {
        evt.preventDefault()
        this.btn.dispatchEvent(
          new Event('submit-form', { bubbles: true, composed: true })
        )
      })

      this.list.addEventListener('pointerdown', (evt) => {
        let target = evt.target.closest('verbal-drag-elem')
        if (target.tagName !== 'verbal-drag-elem'.toUpperCase()) return
        evt.preventDefault()
        target.ondragstart = () => false
        target.setPointerCapture(evt.pointerId)
        this.list.style.height = this.list.getBoundingClientRect().height + 'px'
        let listBottom = this.list.getBoundingClientRect().bottom
        let listTop = this.list.getBoundingClientRect().top
        let targetHeight = target.getBoundingClientRect().height

        let shiftY = evt.clientY - target.getBoundingClientRect().top

        let nextSiblingDragElem = target.nextElementSibling
        if (nextSiblingDragElem) {
          nextSiblingDragElem.style.marginTop = `auto`
        }

        moveAt(evt.clientY)

        function moveAt(clientY) {
          if (listBottom <= clientY) {
            target.style.top = listBottom - shiftY + 'px'
          }
          target.style.top = clientY - shiftY + 'px'
        }

        let currentUnderDragElem = null
        let currentPositionForAdd = null
        let heightClosestDrag = null
        let bottomClosestElem = null
        let timerId = null

        const pointerMove = (evt) => {
          target.style.position = 'fixed'
          target.style.zIndex = 1000

          moveAt(evt.clientY)

          target.hidden = true
          let elemUnderPointer = this.shadowRoot.elementFromPoint(
            evt.clientX,
            evt.clientY
          )
          target.hidden = false

          if (!elemUnderPointer) return

          let underDragElem = elemUnderPointer.closest('verbal-drag-elem')
          if (!underDragElem) return

          if (underDragElem != currentUnderDragElem) {
            if (timerId) clearTimeout(timerId)
            timerId = setTimeout(() => {
              if (currentUnderDragElem) {
                heightClosestDrag = underDragElem.getBoundingClientRect().height
                let bottomUnderDragElem = underDragElem.getBoundingClientRect()
                  .bottom

                let styleCurrentUnderDragElem = underDragElem.style

                if (
                  bottomUnderDragElem - evt.clientY <=
                  heightClosestDrag / 2
                ) {
                  styleCurrentUnderDragElem.marginTop = ''
                  styleCurrentUnderDragElem.marginBottom = `${targetHeight}px`
                  styleCurrentUnderDragElem.transition = 'all 250ms'
                  currentPositionForAdd = 'after'
                } else {
                  styleCurrentUnderDragElem.marginBottom = ''
                  styleCurrentUnderDragElem.marginTop = `${targetHeight}px`
                  styleCurrentUnderDragElem.transition = 'all 250ms'
                  currentPositionForAdd = 'before'
                }

                currentUnderDragElem.style.marginBottom = ''
                currentUnderDragElem.style.marginTop = ''
              }
              currentUnderDragElem = underDragElem
              bottomClosestElem = currentUnderDragElem.getBoundingClientRect()
                .bottom
            }, 200)
          }

          if (underDragElem == currentUnderDragElem) {
            let styleCurrentUnderDragElem = currentUnderDragElem.style

            if (bottomClosestElem - evt.clientY <= heightClosestDrag / 2) {
              styleCurrentUnderDragElem.marginTop = ''
              styleCurrentUnderDragElem.marginBottom = `${targetHeight}px`
              currentUnderDragElem.style.transition = 'all 250ms'
              currentPositionForAdd = 'after'
            } else {
              styleCurrentUnderDragElem.marginBottom = ''
              styleCurrentUnderDragElem.marginTop = `${targetHeight}px`
              currentUnderDragElem.style.transition = 'all 250ms'
              currentPositionForAdd = 'before'
            }
          }
        }

        target.addEventListener('pointermove', pointerMove)

        target.addEventListener('pointerup', (evt) => {
          if (timerId) {
            clearTimeout(timerId)
          }
          target.style.top = ''
          target.style.position = ''
          target.style.zIndex = ''

          if (currentUnderDragElem) {
            currentUnderDragElem.style.marginBottom = ''
            currentUnderDragElem.style.marginTop = ''
            currentUnderDragElem.style.transition = ''
            currentUnderDragElem[currentPositionForAdd](target)
            if (nextSiblingDragElem) {
              nextSiblingDragElem.style.marginTop = ``
            }
          }

          this.list.style.height = ''

          let newOrderElementsById = []
          let elementsList = this.list.querySelectorAll('verbal-drag-elem')

          for (let el of elementsList) {
            newOrderElementsById.push(el._id)
          }
          this.list.dispatchEvent(
            new CustomEvent('redefinition-list', {
              bubbles: true,
              composed: true,
              detail: { newOrder: newOrderElementsById },
            })
          )

          target.removeEventListener('pointermove', pointerMove)
        })
      })
    }

    addLabel(label) {
      let text = label.querySelector('[slot="label-value"]').textContent
      let labelElement = new DragVerbalFormElement(text)
      labelElement._id = label._id
      this.list.append(labelElement)
      this.labels.push(labelElement)

      let newOrderElementsById = []
      let elementsList = this.list.querySelectorAll('verbal-drag-elem')
      for (let el of elementsList) {
        newOrderElementsById.push(el._id)
      }
      this.dispatchEvent(
        new CustomEvent('redefinition-list', {
          bubbles: true,
          composed: true,
          detail: { newOrder: newOrderElementsById },
        })
      )
    }

    update(set) {
      let labels = Array.from(set)
      if (labels.length > this.labels.length) {
        this.addLabel(labels[labels.length - 1])
        console.log(this.labels.length, 'from 1st')
        return
      }

      if (labels.length < this.labels.length) {
        console.log(this.labels.length, 'from 2st')
        let labelsElements = []
        this.labels.forEach((el) => {
          let labelFromState = labels.find((obj) => el._id === obj._id)
          el.update(labelFromState, this.list)
          if (labelFromState) {
            labelsElements.push(el)
          }
        })
        this.labels = labelsElements
        console.log(this.labels.length, 'from 2st')
        return
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <div class="verbal-list__conteiner">
          <h4 class="verbal-list__subtitle">
            <slot name="subtitle">
              Выберите один правильный вариант ответа
            </slot>
          </h4>
          <ol class="verbal-list">
            <slot name="value"></slot>
          </ol>
          <button class="btn" type="submit" disabled>
            Ответить
          </button>
        </div>
      `
    }
  }
)

export class DragVerbalFormElement extends HTMLElement {
  constructor(value) {
    super()
    this.value = value
  }

  connectedCallback() {
    this.innerHTML = `
    <li class="drag__container">
      <div class="drag__elem">${this.value}</div>
    </li>`
  }

  update(label, list) {
    if (!label) {
      this.remove()
      let newOrderElementsById = []
      let elementsList = list.querySelectorAll('verbal-drag-elem')

      for (let el of elementsList) {
        newOrderElementsById.push(el._id)
      }
      list.dispatchEvent(
        new CustomEvent('redefinition-list', {
          bubbles: true,
          composed: true,
          detail: { newOrder: newOrderElementsById },
        })
      )
    }
  }
}

customElements.define('verbal-drag-elem', DragVerbalFormElement)
