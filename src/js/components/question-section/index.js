import css from './style.scss'

customElements.define(
  'question-section',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
    }
    render() {
      this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <section class="question-section">
        <h2 class="question-section__title">
          Вопрос <slot name="number-question"></slot>
        </h2>
        <h3 class="question-section__subtitle">
          <slot name="text-question"></slot>
        </h3>
        <p class="question-section__quest">
          <slot name="advanced-text"></slot>
        </p>
        <slot name="form"></slot>
      </section>
    `
    }
  }
)
