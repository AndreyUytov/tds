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

        let shiftY = evt.clientY - target.getBoundingClientRect().top

        function moveAt(clientY) {
          target.style.top = clientY - shiftY + 'px'
        }

        let currentClosestDragElem = null
        let heightClosestDrag = null
        let currentPositionForAdd = null
        let siblingTarget = target.nextElementSibling
        if (siblingTarget) {
          siblingTarget.style.marginTop = 'auto'
        }

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

          let closestDragElem = elemUnderPointer.closest('verbal-drag-elem')
          if (!closestDragElem) return

          if (siblingTarget) {
            siblingTarget.style.marginTop = ''
          }

          if (closestDragElem != currentClosestDragElem) {
            if (currentClosestDragElem) {
              currentClosestDragElem.style.marginBottom = ''
              currentClosestDragElem.style.marginTop = ''
            }
            currentClosestDragElem = closestDragElem
            heightClosestDrag =
              currentClosestDragElem.getBoundingClientRect().height
          }

          if (closestDragElem == currentClosestDragElem) {
            let bottomClosestElem =
              currentClosestDragElem.getBoundingClientRect().bottom

            let styleCurrentClosestDragElem = currentClosestDragElem.style

            if (bottomClosestElem - evt.clientY <= heightClosestDrag / 2) {
              styleCurrentClosestDragElem.marginTop = ''
              styleCurrentClosestDragElem.marginBottom = 'auto'
              currentPositionForAdd = 'after'
            } else {
              styleCurrentClosestDragElem.marginBottom = ''
              styleCurrentClosestDragElem.marginTop = 'auto'
              currentPositionForAdd = 'before'
            }
          }
        }

        target.addEventListener('pointermove', pointerMove)

        target.addEventListener('pointerup', (evt) => {
          target.style.top = ''
          target.style.position = ''
          target.style.zIndex = ''
          if (siblingTarget) {
            siblingTarget.style.marginTop = ''
          }

          if (currentClosestDragElem) {
            currentClosestDragElem.style.marginBottom = ''
            currentClosestDragElem.style.marginTop = ''
            currentClosestDragElem[currentPositionForAdd](target)
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
        return
      }

      if (labels.length < this.labels.length) {
        let labelsElements = []
        this.labels.forEach((el) => {
          let labelFromState = labels.find((obj) => el._id === obj._id)
          el.update(labelFromState, this.list)
          if (labelFromState) {
            labelsElements.push(el)
          }
        })
        this.labels = labelsElements
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
