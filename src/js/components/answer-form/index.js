import css from './style.scss'

customElements.define(
  'answer-form',
  class extends HTMLElement {
    connectedCallback() {
      this.idCounter = 0
      this.type = this.getAttribute('type') || 'radio'
      this.fon = this.getAttribute('fon') || 'on'
      this.submitButton = this.getAttribute('submit-button') || 'on'

      let labels = this.querySelectorAll('answer-label')
      this.labels = Array.from(labels)
      this.labels.forEach((label) => {
        label._id = this.idCounter++
        label.setAttribute('type', this.type)
        label.setAttribute('fon', this.fon)
      })

      this.attachShadow({ mode: 'open' })
      this.render()

      if (this.type === 'radio') {
        this.shadowRoot.addEventListener('radio-checked', (evt) => {
          this.labels.forEach((label) => {
            if (label._id !== evt.detail.id) {
              label.input.checked = false
            }
          })
        })
      }

      if (this.submitButton === 'on') {
        this.btn = this.shadowRoot.querySelector('.btn')
        this.btn.addEventListener('click', (evt) => {
          evt.preventDefault()
          this.btn.dispatchEvent(
            new Event('submit-form', { bubbles: true, composed: true })
          )
        })
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <form class="answer-form">
        <fieldset class="answer-form__fieldset">
          <legend class="answer-form__legend">
            <slot name="answer-subtitle"></slot>
          </legend>
          <slot name="label"></slot>
        </fieldset>
        <button ${
          this.submitButton !== 'on' ? "style = 'display: none'" : ''
        } class="btn" type="submit" disabled>
          Ответить
        </button>
        <div class="hidden-inputs" hidden>
          <slot></slot>
        </div>
      </form>
    `
    }
  }
)
