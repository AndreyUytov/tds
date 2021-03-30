Если тестов для прохождения нет, то для кнопки выхода из личного кабинета нужно добавить класс _user-section\_\_user-button--akcent_? чтобы стало так -
`<button class="user-section__user-button user-section__user-button--akcent">`

Для формы с ошибкой добавить к тегу `<form class="main-login__form" класс "main-login__form--invalid> `, чтобы стало так -
`<form class="main-login__form main-login__form--invalid> `

###test-page
Управляет состоянием, готовит форму для отправки ответов, слушает изменения в порядке выбранных ответов в вербальных тестах,
имеет три обязательных слота
#####Слоты 1._test-header_ 2._question-section_ - может быть несколько(для вербальных тестов) 3._answer-section_

###test-header
Шапка для тестов, содержит один слот

- `<slot name="test-title">` по умолчанию его значение - _"Тест на оценку квалификации"_
  - Аттрибуты:
    1. _total_ - общее количество вопросов в данном тесте,
    2. _current_ - текущий вопрос
    3. _time-limit-ms_ - лимит времени на тест в ms, default 20min,
       по окончании которого сгенерируется и отправится форма с
       выбранными(если были выбраны) ответами

###question-section
Cекция для вопроса. **В вербальных тестах необходимо добавить класс** `class="verbal-test"`
#####Слоты

- `<slot name="number-question">` - Номер вопроса, например, 2
- `<slot name="text-question">` - Основной текст вопроса
- `<slot name="advanced-text">` - Поясняющий текст вопроса
- `<slot name="form">` - Слот для формы только в вербальных тестах

###answer-form
Блок для формы с вариантами ответов
#####Слоты

- `<slot name="answer-subtitle">` - legend для fieldset, например,
  "Выберите один правильный вариант ответа"
- `<slot name="label">` - слот для answer-label
  _Все тэги помещенные вне слотов будут считаться скрытыми полями(**внимание** - в вербальных тестах скрытые поля нужно добавлять в `<answer-form>`, который расположен в `<question-section>`! )_. Использовать для добавления служебных полей, например так, input name="crsfr" value="1234:M5H49KLNH9", это поле отправится вместе с выбранными ответами после нажатия кнопки Ответить.

#####Аттрибуты

1. _type_ - определяет тип инпутов, по умолчанию стоит тип radio
2. _fon_ - определяет наличие фона у формы, есть два допустимых
   значения - "on" и "Любое другое значение, кроме пустой строки", по умолчанию стоит "on"(темный фон включен)
3. _submit-button_ - опеределяет добавлять кнопку отправить или
   нет. Используется в вербальных тестах. По умолчанию кнопка добавляется. Допустимые значения как и у атрибута fon

###answer-label
Это кастомный label для чекбоксов и радио-инпутов
#####Слоты - содержит один обязательный слот

- `<slot name="label-value">` - куда записывается текст варианта ответа(лучше помещать текст в span) или картинка(обычный img)
  #####Аттрибуты
  1. _name_ и _value_ - такие же как и в обычных input,нужны для
     создания формы для отправки
  2. _type_ и _fon_ - определяются формой в которой находятся,
     нет необходимости определять каждый input отдельно

###answer-section
Секция для отображения вариантов ответа, содержит в себе форму (_verbal-form_ для вербальных тестов или _answer-form_ для обычных) в слоте `<slot name="form">`. В вербальных тестах необходимо добавить класс **class="verbal-test"**

###verbal-form
Форма для вербальных тестов. Содержит в себе следующие **слоты**

- `<slot name="subtitle">` - legend для инпутов, по умолчанию,
  "Выберите один правильный вариант ответа"
- `<slot name="value">` - формируется динамически, при выборе варианта
  ответа пользователем.
  Атрибутов нет.
