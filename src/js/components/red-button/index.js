import css from './style.scss'

customElements.define(
  'red-button',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <button class="btn" type="submit">
        <slot name="text">Ответить</slot>
      </button>
    `
    }
  }
)
