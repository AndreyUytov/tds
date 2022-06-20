const tabs = document.querySelector('.admin-page__tabs');
const formSwiper = document.querySelector('.admin-page__forms-swiper');
let activeTab = document.querySelector('.admin-page__tab.active')

function toogleActiveTab(newActiveTab) {
  console.log(activeTab);
  if(activeTab) {
    activeTab.classList.remove('active')
    activeTab = newActiveTab
    activeTab.classList.add('active')
  }
}

function showShoosenForm (evt) {
  evt.preventDefault();
  const tabBtn = evt.target.closest('.admin-page__tab');
  const tab = tabBtn.id
  console.log(tab);
  if (!tab) return

  switch (tab) {
    case 'education-tab':
      formSwiper.style.transform = 'translateX(-100%)';
      toogleActiveTab(tabBtn)
      return
    case 'test-tab':
      formSwiper.style.transform = 'translateX(0%)';
      toogleActiveTab(tabBtn)
      return
    default:
      return null
  }
}

if(tabs) {
  tabs.addEventListener('click', showShoosenForm)
}