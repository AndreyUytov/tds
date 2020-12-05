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
      <form class="answer-section__form">
        <fieldset class="answer-section__fieldset">
          <legend class="answer-section__legend">
            Выберите несколько правильных вариантов ответа
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
