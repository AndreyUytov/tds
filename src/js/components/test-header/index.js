import css from './style.scss'

customElements.define(
  'test-header',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.totalQuestions = +this.getAttribute('total')
      this.currentQuest = +this.getAttribute('current')
      this.ul = document.createElement('ul')
      this.ul.className = 'tabs-list'
      this.render()
      this.nav = this.shadowRoot.querySelector('nav')
      this.renderTabs()
      this.nav.append(this.ul)
    }

    renderTabs() {
      for (let i = 1; i <= this.totalQuestions; i++) {
        let li = `
        <li class = ${
          i > this.currentQuest
            ? 'tabs-list__item'
            : i < this.currentQuest
            ? 'tabs-list__item tabs-list__item--disabled'
            : 'tabs-list__item tabs-list__item--active'
        }> ${i}
        </li>`

        this.ul.insertAdjacentHTML('beforeend', li)
      }
    }

    render() {
      this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <header class="test-header content">
      <h1 class="test-header__title">
        <slot name="test-title">Тест на оценку квалификации</slot>
      </h1>
      <div class="test-header__wrapper">
        <nav class="test-header__nav">
        </nav>
        <div class="test-header__timer">
          <span class="test-header__timer-text">Время</span>18:58
        </div>
      </div>
    </header>
    `
    }
  }
)
