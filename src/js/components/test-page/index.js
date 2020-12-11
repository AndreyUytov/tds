import css from './style.scss'

customElements.define(
  'test-page',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()

      this.forms = this.querySelectorAll('answer-form')

      if (this.forms.length === 1) {
        this.shadowRoot.addEventListener('submit-form', () => {
          const form = document.createElement('form')
          // form.method = 'POST'
          if (this.checkedInputs) {
            form.append(...this.hiddenInputs, ...this.checkedInputs)
          } else form.append(...this.hiddenInputs)

          document.body.append(form)
          form.submit()
        })
        this.testForm = this.forms[0]
        this.hiddenInputs = this.testForm.shadowRoot
          .querySelector('slot:not([name])')
          .assignedElements()
        this.testForm.shadowRoot.addEventListener('click', (evt) => {
          let target = evt.target
          if (target.tagName !== 'ANSWER-LABEL') return
          this.checkedInputs = []
          this.testForm.labels.map((label) => {
            if (label.input.checked) {
              this.checkedInputs.push(label.input)
            }
          })
          if (this.checkedInputs.length) {
            this.testForm.btn.disabled = false
          }
        })
      } else {
        this.verbalForm = this.querySelector('verbal-form')
        this.forms.forEach((el) => {
          this.verbalForm.innerHTML += `<li slot="value"></li>`
        })
        this.shadowRoot.addEventListener('click', (evt) => {
          let target = evt.target
          if (target.tagName !== 'ANSWER-LABEL') return
          this.checkedInputs = []
          this.forms.forEach((el) => {
            let checkedLabel = el.labels.find(
              (label) => label.input.checked === true
            )
            console.log(checkedLabel)
            let textCheckedlabel = checkedLabel
              .querySelector('slot[name="label-value"]')
              .assignedElements()
            console.log(textCheckedlabel)
            this.verbalForm.innerHTML += `<li slot="value">${textCheckedlabel}</li>`
          })
        })
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
