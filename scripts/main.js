const difficultyForm = document.getElementById('difficulty-form');
const difficultySettings = document.getElementById('dificulty-settings');
const minefield = document.getElementById('minefield');
const scoreContainer = document.getElementById('score');

let score = 0;
scoreContainer.innerHTML = score;

difficultyForm.addEventListener('submit' , function () {
    let sectorsNumber;

    if(difficultySettings.value === 'easy') {
        sectorsNumber = 100;
    } else if(difficultySettings.value === 'medium') {
        sectorsNumber = 81;
    } else {
        sectorsNumber = 49;
    }

    score = 0;
    scoreContainer.innerHTML = score;

    createLandfield(minefield , sectorsNumber);
});


//  Clear elements inside a minefield contrainer, then append a number of landfield sector's div
function createLandfield (minefieldElement , numberOfSectors) {
    const numberOfRowsAndColumns = Math.sqrt(numberOfSectors);
    minefieldElement.style.gridTemplate = `repeat(${numberOfRowsAndColumns} , 1fr) / repeat(${numberOfRowsAndColumns} , 1fr)`;

    const bombPositions = [];
    const proxyBombsCounters = new Array(numberOfSectors).fill(0);

    while(bombPositions.length < 16) {
        let randomBombSectorIndex = randomNumberGenerator(1 , numberOfSectors);

        if(!bombPositions.includes(randomBombSectorIndex)) {
            bombPositions.push(randomBombSectorIndex);

            randomBombSectorIndex--;

            const topOfBombSector = randomBombSectorIndex - numberOfRowsAndColumns , bottomOfBombSector = randomBombSectorIndex + numberOfRowsAndColumns , leftOfBombSector = randomBombSectorIndex - 1 , rightOfBombSector = randomBombSectorIndex + 1;
            const topLeftOfBombSector = topOfBombSector - 1 , topRightOfBombSector = topOfBombSector + 1 , bottomLeftOfBombSector = bottomOfBombSector - 1 , bottomRightOfBombSector = bottomOfBombSector + 1;

            // If not on the left side of the grid
            if(randomBombSectorIndex % numberOfRowsAndColumns !== 0) {
                if(topOfBombSector >= 0) {
                    proxyBombsCounters[topLeftOfBombSector]++;
                }
                proxyBombsCounters[leftOfBombSector]++;
                if(bottomOfBombSector < proxyBombsCounters.length) {
                    proxyBombsCounters[bottomLeftOfBombSector]++;
                }
            }

            if(topOfBombSector >= 0) {
                proxyBombsCounters[topOfBombSector]++;
            }
            if(bottomOfBombSector < proxyBombsCounters.length) {
                proxyBombsCounters[bottomOfBombSector]++;
            }

            // If not on the right side of the grid
            if((randomBombSectorIndex + 1) % numberOfRowsAndColumns !== 0) {
                if(topOfBombSector >= 0) {
                    proxyBombsCounters[topRightOfBombSector]++;
                }
                proxyBombsCounters[rightOfBombSector]++;
                if(bottomOfBombSector < proxyBombsCounters.length) {
                    proxyBombsCounters[bottomRightOfBombSector]++;
                }
            }
        }
    }

    minefield.innerHTML = '';
    
    for (let i = 0 ; i < numberOfSectors ; i++) {
        const minefieldSector = createElementWithClass('div' , 'minefield-sector');
        minefieldSector.setAttribute('data-sector-index' , i + 1);

        minefieldSector.addEventListener('click' , function () {
            const self = this;

            self.classList.add('checked');

            if(bombPositions.includes(parseInt(self.dataset.sectorIndex))) {
                self.innerHTML = '<i class="fa-solid fa-bomb"></i>';
                self.classList.add('exploded');
            } else {
                self.innerHTML = proxyBombsCounters[i];
                self.classList.add(`bombs-in-proximity-${proxyBombsCounters[i]}`);
                score++;
                scoreContainer.innerHTML = score;
            }
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