import svgSprite from './svg-sprite'
import css from './style.scss'

customElements.define(
  'answer-label',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.addEventListener('click', this.imgPopuprender)

      this.name = this.getAttribute('name')
      this.value = this.getAttribute('value')
      this.render()
      this.input = this.shadowRoot.querySelector('input')
      this.marker = this.shadowRoot.querySelector('.test__marker')
      this.label = this.shadowRoot.querySelector('.test__label')
      this.input.addEventListener('change', () => {
        if (this.input.checked) {
          this.input.dispatchEvent(
            new CustomEvent('radio-checked', {
              detail: { id: this._id },
              bubbles: true,
              composed: true,
            })
          )
        }
      })
    }

    static get observedAttributes() {
      return ['type', 'fon']
    }

    attributeChangedCallback() {
      if (this.marker) {
        this.marker.className = `test__marker test__marker--${this.getAttribute(
          'type'
        )}`
        this.input.type = `${this.getAttribute('type')}`
        this.label.className =
          this.getAttribute('fon') === 'on'
            ? `test__label test__label--fon`
            : `test__label`
      }
    }

    imgPopuprender(evt) {
      let target = evt.target
      if (target.tagName === 'IMG') {
        // let naturalWidth = target.naturalWidth
        // if (naturalWidth >= 300) {
        //   evt.preventDefault()
        //   const src = target.src
        //   const popup = document.createElement('div')
        //   popup.style.width = document.documentElement.clientWidth + 'px'
        //   popup.style.height = document.documentElement.clientHeight + 'px'
        //   popup.className = 'answer-popup'
        //   popup.insertAdjacentHTML('beforeend', `<img src=${src} />`)
        //   document.body.append(popup)
        //   popup.onclick = () => popup.remove()
        // }

        evt.preventDefault()
        const src = target.src
        const popup = document.createElement('div')
        popup.style.width = document.documentElement.clientWidth + 'px'
        popup.style.height = document.documentElement.clientHeight + 'px'
        popup.className = 'answer-popup'
        popup.insertAdjacentHTML('beforeend', `<img src=${src} />`)
        document.body.append(popup)
        popup.onclick = () => popup.remove()
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        ${svgSprite}
        <label class="test__label ${
          this.getAttribute('fon') === 'on' ? 'test__label--fon' : ''
        }">
          <input type=${this.getAttribute(
            'type'
          )} class="test__input visually-hidden" name=${this.name} value=${
        this.value
      } />
          <span class="test__marker test__marker--${this.getAttribute('type')}">
            <svg width="16" height="16">
              <use href="#check" />
            </svg>
          </span>
          <span class="test__label-text">
            <slot name="label-value"></slot>
          </span>
        </label>
      `
    }
  }
)
