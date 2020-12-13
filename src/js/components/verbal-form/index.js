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
