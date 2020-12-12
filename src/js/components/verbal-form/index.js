import css from './style.scss'

customElements.define(
  'verbal-form',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
      this.btn = this.shadowRoot.querySelector('.btn')
      this.list = this.shadowRoot.querySelector('.verbal-list')

      this.btn.addEventListener('click', (evt) => {
        evt.preventDefault()
        this.btn.dispatchEvent(
          new Event('submit-form', { bubbles: true, composed: true })
        )
      })
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
