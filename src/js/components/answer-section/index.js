import css from './style.scss'

customElements.define(
  'answer-section',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()
      this.type = this.getAttribute('type') || 'radio'
      this.labels = this.shadowRoot.querySelectorAll('answer-label')

      if (this.type === 'radio') {
        this.shadowRoot.addEventListener('radio-checked', (evt) => {})
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
    <style>${css}</style>
    <section class="answer-section">
      <h2 class="answer-section__title">Варианты ответов</h2>
      <form class="answer-section__form">
        <fieldset class="answer-section__fieldset">
          <legend class="answer-section__legend">
            <slot name="answer-subtitle">
              Выберите один правильный вариант ответа
            </slot>
          </legend>
          <slot name="label"></slot>
        </fieldset>
        <slot name="submit-button"></slot>
      </form>
    </section>
    `
    }
  }
)
