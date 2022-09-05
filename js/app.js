const searchButton = document.querySelector('.header__search-icon');
const searchInput = document.querySelector('.header__search input');

searchButton.addEventListener('click', () => {
    searchInput.classList.toggle('active');
});
