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
      this.labels.push(label._id)
      let text = label.querySelector('[slot="label-value"]').textContent
      this.list.append(new DragVerbalFormElement(text))
    }

    update(arr) {
      let labels = Array.from(arr)
      if (labels.length > this.labels.length) {
        console.log(this.labels.length, 'from 1st')
        this.addLabel(labels[labels.length - 1])
        return
      }

      if (labels.length <= this.labels.length) {
        console.log(this.labels.length, 'from 2st')
        let labelsElements = []
        this.labels.forEach((el) => {
          let labelFromState = labels.find((obj) => el._id === obj._id)
          el.update(labelFromState)
          if (labelsFromState) {
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

  update(label) {
    if (!label) {
      this.remove()
    }
  }
}

customElements.define('verbal-drag-elem', DragVerbalFormElement)
