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
        this.counterForms = 0
        this.checkedInputs = []
        this.hiddenInputs = []
        this.verbalForm = this.querySelector('verbal-form')
        this.forms.forEach((el) => {
          this.hiddenInputs.push(
            ...el.shadowRoot
              .querySelector('slot:not([name])')
              .assignedElements()
          )
          el._id = this.counterForms++
          this.verbalForm.innerHTML += `<li slot="value"></li>`
        })

        this.shadowRoot.addEventListener('click', (evt) => {
          let target = evt.target
          if (target.tagName !== 'ANSWER-LABEL') return
          this.checkedInputs.push(target.input)
          let formId = target.closest('answer-form')._id
          let textCheckedlabel = target.querySelector('[slot="label-value"]')
            .textContent
          this.verbalForm.querySelectorAll('li')[
            formId
          ].textContent = textCheckedlabel
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
