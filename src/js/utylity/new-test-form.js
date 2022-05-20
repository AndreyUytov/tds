const form = document.querySelector('#form')

if (form) {
  const elements = Array.from(form.elements)
  const submit = document.querySelector('#submit')
  const fields = new Map()

  elements.forEach((el) => {
    if (el.type === 'radio') {
      if (!fields.has(el.name)) {
        fields.set(el.name, false)
      }

      let flag = false
      el.onclick = function (evt) {
        fields.set(evt.target.name, evt.target.value)
        for (let value of fields.values()) {
          console.log(fields)
          if (value === false) {
            flag = true
            return
          }

          flag = false
        }

        submit.disabled = flag
      }
    }
  })

  form.addEventListener('submit', (evt) => {
    evt.preventDefault()
    window.location.pathname = '/new-test-result.html'
    //   let form = document.createElement('form')
    //   form.method = 'POST'
    //   let html = ''
    //   fields.forEach((value, key) => {
    //     html += `<input name=${key} value=${value} />`
    //   })
    //   form.innerHTML = `${html}`
    //   document.body.append(form)
    //   form.submit()
  })
}
