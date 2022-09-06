//Constants
const baseUrl = 'https://randomuser.me/api/';

const fetchData = async () => {
    const data = await fetch(`${ baseUrl }?results=20`);

    const { results } = await data.json();

    return results;

}
const createUserCard = (user) => {
    const { name, dob: { age }, email, phone, location, picture, gender } = user;
    console.log(location);
    const userCard = document.createElement('div');

    userCard.classList.add('user-card');

    userCard.innerHTML = `
                          <div class="user-card__inner"> 
                             <div class="user-card__image">
                                <img src="${ picture.large }" alt="user-photo">
                             </div>
                             <div class="user-card__name">${ name.first } ${ name.last }</div>
                             <div class="user-card__age">I have ${ age } years old</div>
                             <div class="user-card__email">
                                <img class="user-card__icon" src="./icons/email.png" alt="">
                                <span>${ email }</span>
                             </div>
                             <div class="user-card__phone">
                                <img class="user-card__icon" src="./icons/phone.png" alt="">
                                <span>${ phone }</span>
                             </div>
                             <div class="user-card__location">
                                <img class="user-card__icon" src="./icons/location.png" alt="">
                                <span>${ location.country }</span>
                              </div>
                          </div>
                          <div class="user-card__gender">
                           <span>${ gender.toUpperCase() }</span>
                          </div>
`;

    return userCard;
}

const renderData = async () => {
    const main = document.querySelector('.main');

    const users = await fetchData();

    const userCards = users.map((user) => createUserCard(user));

    main.append(...userCards);
};

renderData();

const searchButton = document.querySelector('.header__search-icon');
const searchInput = document.querySelector('.header__search input');

searchButton.addEventListener('click', () => {
    searchInput.classList.toggle('active');
});
