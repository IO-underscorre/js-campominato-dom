const difficultyForm = document.getElementById('difficulty-form');
const difficultySettings = document.getElementById('dificulty-settings');
const minefield = document.getElementById('minefield');

difficultyForm.addEventListener('submit' , function () {
    let sectorsNumber;

    if(difficultySettings.value === 'easy') {
        sectorsNumber = 100;
    } else if(difficultySettings.value === 'medium') {
        sectorsNumber = 81;
    } else {
        sectorsNumber = 49;
    }

    createLandfield(minefield , sectorsNumber);
});


//  Clear elements inside a minefield contrainer, then append a number of landfield sector's div
function createLandfield (minefieldElement , numberOfSectors) {
    const numberOfRowsAndColumns = Math.sqrt(numberOfSectors);
    minefieldElement.style.gridTemplate = `repeat(${numberOfRowsAndColumns} , 1fr) / repeat(${numberOfRowsAndColumns} , 1fr)`;

    const bombPositions = [];

    while(bombPositions.length < 16) {
        randomNumber = randomNumberGenerator(1 , numberOfSectors);

        if(!bombPositions.includes(randomNumber)) {
            bombPositions.push(randomNumber);
        }
    }

    minefield.innerHTML = '';
    
    for (i = 0 ; i < numberOfSectors ; i++) {
        minefieldSector = createElementWithClass('div' , 'minefield-sector');
        minefieldSector.setAttribute('data-sector-index' , i + 1);

        minefieldSector.addEventListener('click' , function () {
            this.classList.add('checked');
        });

        minefieldElement.append(minefieldSector);
    }
}


// Create an element with a class
function createElementWithClass(elementTag , className) {
    const element = document.createElement(elementTag);
    element.classList.add(className);
    return element;
}


// Random number generator between max and min (included)
function randomNumberGenerator(min , max) {
    return Math.floor((Math.random()) * (max - min + 1)) + min;
}