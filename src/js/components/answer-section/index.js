import css from './style.scss'

customElements.define(
  'answer-section',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
    }

    render() {
      this.shadowRoot.innerHTML = `
    <style>${css}</style>
    <section class="answer-section">
      <h2 class="answer-section__title">Варианты ответов</h2>
      <slot name="form"></slot>
    </section>
    `
    }
  }
)
