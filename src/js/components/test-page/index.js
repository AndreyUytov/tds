import css from './style.scss'

customElements.define(
  'test-page',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.render()

      this.forms = this.querySelectorAll('question-section answer-form')

      if (!this.forms.length) {
        this.shadowRoot.addEventListener('submit-form', () => {
          const form = document.createElement('form')
          // form.method = 'POST'
          if (this.checkedInputs) {
            form.append(...this.hiddenInputs, ...this.checkedInputs)
          } else form.append(...this.hiddenInputs)

          document.body.append(form)
          form.submit()
        })
        this.testForm = this.querySelector('answer-form')
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
          } else {
            this.testForm.btn.disabled = true
          }
        })
      } else if (this.forms.length === 1) {
        this.shadowRoot.addEventListener('submit-form', () => {
          const form = document.createElement('form')
          // form.method = 'POST'
          this.checkedInputs = []
          this.checkedLabelsOrderById.forEach((id) => {
            this.checkedInputs.push(this.testForm.labels[id].input)
          })

          if (this.checkedInputs) {
            form.append(...this.hiddenInputs, ...this.checkedInputs)
          } else form.append(...this.hiddenInputs)

          document.body.append(form)
          form.submit()
        })
        this.idCounter = 0
        this.testForm = this.forms[0]
        this.dragForm = this.querySelector('verbal-form')
        this.dragForm.list.className = 'drag__list'
        this.hiddenInputs = this.testForm.shadowRoot
          .querySelector('slot:not([name])')
          .assignedElements()
        this.testForm.labels.forEach((label) => {
          label._id = this.idCounter++
        })

        this.checkedLabels = new Set()
        this.shadowRoot.addEventListener('click', (evt) => {
          let target = evt.target
          if (target.tagName !== 'ANSWER-LABEL') return

          if (target.input.checked) {
            this.checkedLabels.add(target)
          } else {
            this.checkedLabels.delete(target)
          }

          if (this.checkedLabels.size) this.dragForm.btn.disabled = false
          if (!this.checkedLabels.size) this.dragForm.btn.disabled = true

          this.dragForm.update(this.checkedLabels)
        })

        this.checkedLabelsOrderById = []
        this.shadowRoot.addEventListener('redefinition-list', (evt) => {
          this.checkedLabelsOrderById = evt.detail.newOrder
        })
      } else {
        this.shadowRoot.addEventListener('submit-form', () => {
          const form = document.createElement('form')
          // form.method = 'POST'
          if (this.checkedInputs) {
            form.append(...this.hiddenInputs, ...this.checkedInputs)
          } else form.append(...this.hiddenInputs)

          document.body.append(form)
          form.submit()
        })
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

          let form = target.closest('answer-form')
          form._done = true
          let formsChecked = Array.from(this.forms).filter(
            (form) => form._done !== true
          )
          if (!formsChecked.length) {
            this.verbalForm.btn.disabled = false
          } else this.verbalForm.btn.disabled = true

          let formId = form._id
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
