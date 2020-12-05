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
      this.shadowRoot.addEventListener('click', (evt) => {
        let target = evt.target
        if (target.tagName === 'IMG') {
          evt.preventDefault()
          let naturalWidth = target.naturalWidth
          if (naturalWidth >= 200) {
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
      })
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
