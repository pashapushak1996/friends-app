//Elements constants
const content = document.querySelector('.content');
const input = document.querySelector('.header__search input');
const searchButton = document.querySelector('.header__search-icon');
const searchInput = document.querySelector('.header__search input');
const radioButtons = document.getElementsByTagName('input');

//Constants
const baseUrl = 'https://randomuser.me/api/';

const asidePanelOptions = {
    AGE: 'age',
    NAME: 'name',
    GENDER: 'gender',
    ASC: 'asc',
    DESC: 'desc'
};

const initialUsers = [];


async function getUsers() {
    try {
        const data = await fetch(`${ baseUrl }?results=20`);

        const { results: users } = await data.json();

        return users.map((user) => ({
                fullName: user.name.first + ' ' + user.name.last,
                age: user.dob.age,
                gender: user.gender,
                email: user.email,
                picture: user.picture.large,
                country: user.location.country,
                phone: user.phone
            })
        );
    } catch ({ message }) {
        console.log(message);
    }

}

const sortUsers = (users) => {
    const sortingOption = document.querySelector('input[name=sort-options]:checked').value;

    const sortBy = sortingOption.split('-')[0];
    const orderBy = sortingOption.split('-')[1];

    if (!orderBy) {
        return users;
    }

    switch (sortBy) {
        case 'age': {
            const sortedUsers = users.sort((userOne, userTwo) => userOne.age - userTwo.age);

            return orderBy === asidePanelOptions.ASC ? sortedUsers : sortedUsers.reverse();
        }
        case 'name': {
            const sortedUsers = users.sort((userOne, userTwo) => {

                if (userOne.fullName.toLowerCase() > userTwo.fullName.toLowerCase()) {
                    return -1;
                }
                if (userOne.fullName.toLowerCase() < userTwo.fullName.toLowerCase()) {
                    return 1;
                }
            });

            return orderBy === asidePanelOptions.ASC ? sortedUsers : sortedUsers.reverse();
        }

        default: {
            break;
        }
    }
};

const filterButton = document.querySelector('#filter-button');
const resetButton = document.querySelector('#reset-button');
const genderRadio = document.querySelector('#all-genders');
const nameRadio = document.querySelector('#alphabetical');
const minAgeInput = document.querySelector('#min-age');
const maxAgeInput = document.querySelector('#max-age');

const filterUsers = (users, filterBy) => {
    switch (filterBy) {
        case 'age': {
            const minAge = minAgeInput.value || 0;
            const maxAge = maxAgeInput.value || 200;

            return users.filter((user) => user.age >= Number(minAge) && user.age <= Number(maxAge));
        }

        case 'gender': {
            const genderRadio = document.querySelector('input[name="genders"]:checked');
            const gender = genderRadio.value;

            return gender !== 'all-genders' ? users.filter((user) => user.gender === gender) : users;
        }
        default: {
            break;
        }
    }
}

function filterBtnOnClick() {
    content.innerHTML = '';
    const filteredUsersByAge = filterUsers(initialUsers, asidePanelOptions.AGE);
    const filteredUsersByGender = filterUsers(filteredUsersByAge, asidePanelOptions.GENDER);
    const sortedUsers = sortUsers(filteredUsersByGender);

    renderUsersList(sortedUsers);
}

function resetBtnOnClick() {
    content.innerHTML = '';
    genderRadio.checked = true;
    nameRadio.checked = true;
}


filterButton.addEventListener('click', filterBtnOnClick);
resetButton.addEventListener('click', resetBtnOnClick);

const searchByName = ({ target: { value } }) => {
    const normalizedValue = value.trim().toLowerCase();

    const userCards = document.querySelectorAll('.user-card__name');

    userCards.forEach((userCard) => {
        const firstName = userCard.innerText
            .split(' ')
            .shift()
            .toLowerCase();

        const lastName = userCard.innerText
            .split(' ')
            .pop()
            .toLowerCase();

        const isVisible = firstName.startsWith(normalizedValue) || lastName.startsWith(normalizedValue);

        userCard.parentElement.parentElement.classList.toggle('none', !isVisible);
    });
};

searchInput.addEventListener('input', searchByName);

const renderUsersList = (users) => {
    const usersGrid = users.map((user) => createUserCard(user));

    content.append(...usersGrid);
};

const createUserCard = (user) => {
    const { fullName, age, email, phone, country, picture, gender } = user;

    const userCard = document.createElement('div');

    userCard.classList.add('user-card');

    userCard.innerHTML = `
                          <div class="user-card__inner"> 
                             <div class="user-card__image">
                                <img src="${ picture }" alt="user-photo">
                             </div>
                             <div class="user-card__name">${ fullName }</div>
                             <div data-age="${ age }" class="user-card__age">I have ${ age } years old</div>
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
                                <span>${ country }</span>
                              </div>
                          </div>
                          <div data-gender="${ gender.toLowerCase() }" class="user-card__gender">
                           <span>${ gender.toUpperCase() }</span>
                          </div>
`;

    return userCard;
};

const setUsers = async () => {
    try {
        const users = await getUsers();

        initialUsers.push(...users);

        renderUsersList(initialUsers);
    } catch ({ message }) {
        console.log(message);
    }
};

setUsers();

searchButton.addEventListener('click', () => {
    searchInput.classList.toggle('active');
});

