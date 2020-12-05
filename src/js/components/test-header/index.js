import css from './style.scss'

customElements.define(
  'test-header',
  class extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: 'open' })
      this.totalQuestions = +this.getAttribute('total')
      this.currentQuest = +this.getAttribute('current')
      this.testStarted = new Date(
        +this.getAttribute('test-started-ms') || Date.now()
      )
      this.timeLimit = +this.getAttribute('time-limit-ms') || 1200000
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
      setInterval(() => {
        let time = new Date(this.timeLimit - (Date.now() - this.testStarted))
        let differenceMin = time.getMinutes()
        if (differenceMin < 5) {
          this.timer.style.color = 'var(--redThemeColor)'
        }
        let differenceSec = time.getSeconds()
        this.timer.textContent = `${differenceMin} : ${
          differenceSec < 10 ? '0' + differenceSec : differenceSec
        }`
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
