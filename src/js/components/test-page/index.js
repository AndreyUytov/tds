import css from './style.scss'

customElements.define(
  'test-page',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()

      this.forms = this.querySelectorAll('answer-form')
      console.log(this.forms)

      if (this.forms.length === 1) {
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <slot name="test-header"></slot>
        <main class="test-main content">
          <section class="left-section">
            <slot name="question-section"></slot>
          </section>
          <div class="sticky-section">
            <slot name="answer-section"></slot>
          </div>
        </main>
      `
    }
  }
)
