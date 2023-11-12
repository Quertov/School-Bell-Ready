const timeSpan = document.querySelector('.hero .time-container .time');
const nowSpan = document.querySelector('.hero .now-container .now');
const root = document.querySelector('.root');
const hero = document.querySelector('.hero');

const toggleCircle = document.querySelector('.modal .modal-inner .bell-settings .toggle-container .toggle-out .toggle-circle');
const toggleOut = document.querySelector('.modal .modal-inner .bell-settings .toggle-container .toggle-out');
let ringOn = true;

const inputs = document.querySelectorAll('.modal .modal-inner .shedule-settings .lesson-list .time-input-block .time-input');
const ringSound = new Audio('./sounds/ring.mp3');
let lessonSoundPlayed;

toggleOut.addEventListener('click', () => {
    ringOn = !ringOn;
    ringSound.currentTime = ringSound.duration;

    if (!ringOn) {
        toggleOut.style.backgroundColor = '#cccccc';
        toggleCircle.style.left = '4px';
    } else {
        toggleOut.style.backgroundColor = '#9dd25c';
        toggleCircle.style.left = '36px';
    }
});



const RED = '#BA4949';
const LIGHTRED = '#c15c5c';
const GREEN = '#518A58';
const LIGHTGREEN = '#639669';
const BLUE = '#397097';
const LIGHTBLUE = '#4D7FA2';

const schoolTime = {
    1: [8, 0, 8, 45],
    2: [8, 55, 9, 40],
    3: [9, 50, 10, 35],
    4: [10, 55, 11, 40],
    5: [11, 50, 12, 35],
    6: [12, 45, 13, 30],
    7: [13, 40, 14, 25],
};

function inputHandler(inputId, inputEvent) {
    const lessonIdArray = inputId.split('-');
    const lessonTime = lessonIdArray[1];
    const lessonUnits = lessonIdArray[2];
    const lessonNum = Number(lessonIdArray[3]);
    
    if (lessonTime === 'start') {
        if (lessonUnits === 'hours') {
            schoolTime[lessonNum][0] = Number(inputEvent.target.value);
        } else if (lessonUnits === 'minutes') {
            schoolTime[lessonNum][1] = Number(inputEvent.target.value);
        }
    } else if (lessonTime === 'end') {
        if (lessonUnits === 'hours') {
            schoolTime[lessonNum][2] = Number(inputEvent.target.value);
        } else if (lessonUnits === 'minutes') {
            schoolTime[lessonNum][3] = Number(inputEvent.target.value);
        }
    }
}

inputs.forEach(input => {
    input.addEventListener('change', e => {
        inputHandler(input.id, e);
    });
});

const sevenLessonEnd = Number(schoolTime[7][2].toString() + schoolTime[7][3].toString())

lessonSoundPlayed = {
    1: [false, false],
    2: [false, false],
    3: [false, false],
    4: [false, false],
    5: [false, false],
    6: [false, false],
    7: [false, false],
};


function setTime() {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const day = time.getDay();

    let result = '';
    if (hours < 10) result += '0';
    result += `${hours}:`;
    if (minutes < 10) result += '0';
    result += `${minutes}`;
    timeSpan.textContent = result;

    if (day === 6 || day === 0) {
        nowSpan.textContent = 'Сьогодні вихідний';
        return;
    }

    root.style.backgroundColor = BLUE;
    hero.style.backgroundColor = LIGHTBLUE;
    modalBtn.style.backgroundColor = LIGHTBLUE;
    nowSpan.textContent = 'Школи немає';

    for (lesson in schoolTime) {
        if (schoolTime.hasOwnProperty(lesson)) {
            let lessonStart = schoolTime[lesson][0].toString() + schoolTime[lesson][1].toString();
            let nextLessonStart;

            if (schoolTime[lesson][1] === 0 && lesson !== 1) {
                lessonStart += '0';
            }

            if (schoolTime[Number(lesson) + 1]) {
                nextLessonStart = schoolTime[Number(lesson) + 1][0].toString() + schoolTime[Number(lesson) + 1][1].toString();
                if (schoolTime[Number(lesson) + 1][1] === 0) {
                    nextLessonStart += '0';
                }
            }

            if (lesson === 1) {
                lessonStart += '0';
            }

            let lessonEnd = schoolTime[lesson][2].toString() + schoolTime[lesson][3].toString();

            if (schoolTime[lesson][3].toString().length === 1) {
                lessonEnd = schoolTime[lesson][2].toString() + '0' + schoolTime[lesson][3].toString();
            }

            if (schoolTime[lesson][3] === 0) {
                lessonEnd += '0';
            }

        
            let currentTime = hours.toString();
            if (minutes < 10) {
                currentTime += '0';
            }
            currentTime += minutes.toString();
            
            if (Number(currentTime) >= Number(lessonStart) && Number(currentTime) < Number(lessonEnd)) {
                root.style.backgroundColor = RED;
                hero.style.backgroundColor = LIGHTRED;
                nowSpan.textContent = `Зараз триває ${lesson} урок`;
                modalBtn.style.backgroundColor = LIGHTRED;
                
                if (!ringOn) return;

                if (!lessonSoundPlayed[Number(lesson)][0]) {
                    ringSound.currentTime = 0;
                    ringSound.play();
                    lessonSoundPlayed[Number(lesson)][0] = true;
                }
            } else if (Number(currentTime) >= Number(lessonEnd) && Number(currentTime) < Number(nextLessonStart)) {
                root.style.backgroundColor = GREEN;
                hero.style.backgroundColor = LIGHTGREEN;
                nowSpan.textContent = 'Перерва';
                modalBtn.style.backgroundColor = LIGHTGREEN;
                
                if (!ringOn) return;

                if (!lessonSoundPlayed[Number(lesson)][1]) {
                    ringSound.currentTime = 0;
                    ringSound.play();
                    lessonSoundPlayed[Number(lesson)][1] = true;
                }
            } else if (Number(currentTime) === sevenLessonEnd + 1) {
                if (!ringOn) return;

                if (!lessonSoundPlayed[Number(lesson)][0]) {
                    ringSound.play();
                    lessonSoundPlayed[Number(lesson)][0] = true;
                }
            }
        }
    }
}

setInterval(setTime, 1000);