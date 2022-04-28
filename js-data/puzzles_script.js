(() => {
    // my code
})()
const letters = [
    {
        id: 'itemToImage_1',
        data: 'd',
        letter: "d",
    },
    {
        id: 'itemToImage_2',
        data: 'o',
        letter: "o",
    },
    {
        id: 'itemToImage_3',
        data: 'l',
        letter: "l",
    },
    {
        id: 'itemToImage_4',
        data: 'l',
        letter: "l",
    }

];

const randomLetters = () => letters.sort(() => Math.random() > 0.5 ? 1 : -1);

const wordPazzleWrappere = document.querySelector('.wordPazzleWrappere');
const interakt_zadanie = wordPazzleWrappere.parentElement;
const headCheck = interakt_zadanie.previousElementSibling;

const drop = headCheck.querySelector('.drop');
const check_your = headCheck.querySelector('.check_your');
const result = headCheck.querySelector('.result');

const wordPazzle_dropWrapper = document.querySelector('.wordPazzle_dropWrapper');
const wordPazzle_letters = document.querySelector('.wordPazzle_letters');

drop.addEventListener('click', resetPuzzle);

let startAction = false;

letters.forEach((elem) => {
    wordPazzle_dropWrapper.innerHTML += ` <div class="wordPazzle_dropWord" drop-data="${elem.data}"></div>`;
});


randomLetters().forEach((elem) => {
    wordPazzle_letters.innerHTML += `<div class="wordPazzle_letter" drag-data="${elem.data}">
    <img class="wordPazzle_letter_img" src="Images_1/puzzles_img/singlePazzle.png" alt="" draggable="false" />
    <p class="wordPazzle_letter_p">${elem.data}</p>
    </div>`;
});


const draggingPuzzle = document.querySelectorAll('.wordPazzle_letter');
const draggingElemsWidth = `${letters.length * (draggingPuzzle[0].clientWidth - draggingPuzzle[0].clientWidth * 0.2)}px`;

wordPazzle_dropWrapper.style.width = draggingElemsWidth;


let draggingItem;
let elemBelow;


draggingPuzzle.forEach((e) => {
    e.addEventListener('pointerdown', mouseDown);
});


function mouseDown(event) {
    if (event.button === 2) return;
    draggingItem = event.target;
    draggingItem.style.touchAction = 'none'; //ОБЯЗАТЕЛЬНОЕ УСЛОВИЕ(МОЖНО УБРАТЬ И ПРОПИСАТЬ В СТИЛЬ САМОМУ ОБЪЕКТУ) 
    draggingItem.style.cursor = 'grabbing';
    let shiftX = event.clientX - draggingItem.getBoundingClientRect().left;
    let shiftY = event.clientY - draggingItem.getBoundingClientRect().top;

    // ЛИММИТЫ КООРДИНАТ ОГРАНИЧИВАЮЩИЕ ВЫЛЕТ ПЕРЕТАСКИВАЕМОГО ЭЛЕМЕНТА ЗА БЛОК
    //  (ПО УМОЛЧАНИЮ interact_zadanie - РОДИТЕЛЬ ВАШЕГО БЛОКА)
    let limits = {
        top: interakt_zadanie.offsetTop,
        right: interakt_zadanie.offsetWidth + interakt_zadanie.offsetLeft,
        bottom: interakt_zadanie.offsetHeight + interakt_zadanie.offsetTop,
        left: interakt_zadanie.offsetLeft
    };

    draggingItem.style.position = 'absolute';
    draggingItem.style.zIndex = 1000;
    document.body.appendChild(draggingItem);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
        draggingItem.style.left = pageX - shiftX + 'px';
        draggingItem.style.top = pageY - shiftY + 'px';
    }

    elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    let clickWithoutMove = true;
    function onMouseMove(event) {
        let newLocation = {
            x: limits.left,
            y: limits.top
        };
        if (event.pageX > limits.right) {
            newLocation.x = limits.right;
        }
        else if (event.pageX > limits.left) {
            newLocation.x = event.pageX;
        }
        if (event.pageY > limits.bottom) {
            newLocation.y = limits.bottom;
        }
        else if (event.pageY > limits.top) {
            newLocation.y = event.pageY;
        }

        clickWithoutMove = false
        moveAt(newLocation.x, newLocation.y);

        if (event.path[0] !== draggingItem) {
            window.addEventListener('pointerup', moveOut);
        }
        draggingItem.hidden = true;
        elemBelow = document.elementFromPoint(event.clientX, event.clientY);
        draggingItem.hidden = false;
        if (!elemBelow) return;

        // ОБРАБОТКА СОБЫТИЯ НАХОЖДЕНИЯ НАД БЛОКОМ И ВЫЛЕТА ИЗ НЕГО (ПО НЕОБХОДИМИОСТИ)

        // let currentDroppable = null;

        // let droppableBelow = elemBelow.closest('.droppable'); // БЕРЁМ НУЖНЫЙ БЛОК 

        // if (currentDroppable != droppableBelow) {
        //     if (currentDroppable) { 
        // ЛОГИКА ОБРАБОТКИ ПРОЦЕССА "ВЫЛЕТА" ИЗ DROPPABLE
        //         leaveDroppable(currentDroppable);
        //     }
        //     currentDroppable = droppableBelow;
        // ЛОГИКА ОБРАБОТКИ ПРОЦЕССА, КОГДА МЫ "ВЛЕТАЕМ" В ЭЛЕМЕНТ
        //     if (currentDroppable) {
        //         enterDroppable(currentDroppable);
        //     }
        // }
    }

    // КОГДА НАД ВЫБРАННЫМ БЛОКОМ
    function enterDroppable(currentDroppable) {
        // currentDroppable
    }
    // КОДА ВЫЛЕТЕЛИ ИЗ БЛОКА
    function leaveDroppable(currentDroppable) {
        // currentDroppable
    }
    document.addEventListener('pointermove', onMouseMove);


    // КОГДА ВО ВРЕМЯ ПЕРЕТАСКИВАНИЯ КУРСОР ВЫНЕСЛИ ЗА ПРЕДЕЛЫ ОКНА БРАУЗЕРА И ОТПУСТИЛИ ЗАХВАТ ЭЛЕМЕНТА
    function moveOut(e) {
        changeStylesAndAppend(wordPazzle_letters, draggingItem);
        window.removeEventListener('pointerup', moveOut);
        document.removeEventListener('pointermove', onMouseMove);
    }

    // КОГДА КУРСОР В ЗОНЕ ДЛЯ ПЕРЕТАСКИВАНИЙ И ПОЛЬЗОВАТЕЛЬ ОТПУСТИЛ ЗАХВАТ ЭЛЕМЕНТА
    draggingItem.onpointerup = function () {
        draggingItem.style.cursor = 'grab';
        startAction = true;
        checkButton_classList_changer();
        if (clickWithoutMove) {
            changeStylesAndAppend(wordPazzle_letters, draggingItem);
            return document.removeEventListener('pointermove', onMouseMove);
        }
        document.removeEventListener('pointermove', onMouseMove);

        // ЛОГИКА ОБРАБОТКИ ПОПАДАНИЯ НА НУЖНЫЙ БЛОК И НАОБОРОТ
        if (elemBelow.classList.contains('wordPazzle_dropWord')) {
            changeStylesAndAppend(elemBelow, draggingItem);
        }
        else {
            changeStylesAndAppend(wordPazzle_letters, draggingItem);
        }
    };

    function changeStylesAndAppend(dropPlace, draggingElem) {
        draggingElem.style.position = 'relative ';
        draggingElem.style.zIndex = null;
        draggingElem.style.top = null;
        draggingElem.style.left = null;
        dropPlace.appendChild(draggingElem);
    }
};


function checkButton_classList_changer() {

    if (check_your.classList.contains('check_your_active') && !startAction) {
        check_your.classList.remove('check_your_active');
        check_your.removeEventListener('click', checkPuzzle);
    }
    else if (!check_your.classList.contains('check_your_active') && startAction) {
        check_your.removeEventListener('click', checkPuzzle);
        check_your.classList.add('check_your_active');
        check_your.addEventListener('click', checkPuzzle);
    }
}


function resetPuzzle() {
    startAction = false;
    checkButton_classList_changer();
    feedBackChanger('reset')
    wordPazzle_dropWrapper.childNodes.forEach(item => {
        if (item.childNodes.length > 0) {
            wordPazzle_letters.appendChild(item.childNodes[0]);
        }
    });
}

function checkPuzzle() {
    let winCount = 0;
    wordPazzle_dropWrapper.childNodes.forEach(item => {
        if (item.childNodes.length > 0) {
            if (item.attributes.getNamedItem('drop-data').value === item.childNodes[0].attributes.getNamedItem('drag-data').value) {
                winCount++;
            }
        }
    })

    if (winCount === letters.length) {
        feedBackChanger('win');
    }
    else {
        feedBackChanger('lose');
    }
}

function feedBackChanger(state) {
    if (startAction && state === 'win' || state === 'lose') {
        result.classList.add(`result_${state}`);
    }
    else {
        result.classList.remove(`result_win`);
        result.classList.remove(`result_lose`);
    }

}
