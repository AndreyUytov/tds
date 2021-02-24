import css from './style.scss'

customElements.define(
  'test-header',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.totalQuestions = +this.getAttribute('total')
      this.currentQuest = +this.getAttribute('current')
      this.timeLimit = +this.getAttribute('time-limit-s') || 1200
      this.ul = document.createElement('ul')
      this.ul.className = 'tabs-list'
      this.render()
      this.nav = this.shadowRoot.querySelector('nav')
      this.timer = this.shadowRoot.querySelector('.test-header__timer-numbers')
      this.timerRender()
      this.renderTabs()
      this.nav.append(this.ul)
    }

    timerRender() {
      let time = this.timeLimit
      setInterval(() => {
        time -= 1
        let timeForShowing = new Date(time * 1000)
        let differenceMin = timeForShowing.getMinutes()
        if (differenceMin < 5) {
          this.timer.style.color = 'var(--redThemeColor)'
        }
        let differenceSec = timeForShowing.getSeconds()
        this.timer.textContent = `${differenceMin}:${
          differenceSec < 10 ? '0' + differenceSec : differenceSec
        }`
        if (time <= 1) {
          this.shadowRoot.dispatchEvent(
            new Event('submit-form', { bubbles: true, composed: true })
          )
        }
      }, 1000)
    }

    renderTabs() {
      for (let i = 1; i <= this.totalQuestions; i++) {
        let li = `
        <li ${
          i > this.currentQuest
            ? 'class = "tabs-list__item"'
            : i < this.currentQuest
            ? 'class = "tabs-list__item tabs-list__item--disabled"'
            : 'class = "tabs-list__item tabs-list__item--active"'
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
          <span class="test-header__timer-text">Время</span>
          <span class="test-header__timer-numbers"></span>
        </div>
      </div>
    </header>
    `
    }
  }
)
