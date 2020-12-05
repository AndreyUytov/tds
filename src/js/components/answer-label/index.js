import svgSprite from './svg-sprite'
import css from './style.scss'

customElements.define(
  'answer-label',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.type = this.getAttribute('type') || 'radio'
      this.fon = this.getAttribute('fon') || 'true'
      this.render()
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        ${svgSprite}
        <label class="test__label ${
          this.fon === 'true' ? 'test__label--fon' : ''
        }">
          <input type="checkbox" class="test__input visually-hidden" />
          <span class="test__marker test__marker--${this.type}">
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
