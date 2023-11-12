const modalBtn = document.querySelector('.settings-btn');
const modal = document.querySelector('.modal');
const closeModalBtn = document.getElementById('closeModalBtn');

modalBtn.addEventListener('click', () => {
    modal.classList.add('open');
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('open');
});

document.addEventListener('click', () => {
    if (event.target === modal) {
        modal.classList.remove('open');
    }
});