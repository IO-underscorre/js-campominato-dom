const difficultyForm = document.getElementById('difficulty-form');
const difficultySettings = document.getElementById('dificulty-settings');
const minefield = document.getElementById('minefield');
const scoreContainer = document.getElementById('score');

const numberOfBombs = 16;

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

    // Resetting the page to default
    minefield.style.pointerEvents = 'auto';
    minefield.innerHTML = '';
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

    while(bombPositions.length < numberOfBombs) {
        let randomBombSectorIndex = randomNumberGenerator(1 , numberOfSectors);

        if(!bombPositions.includes(randomBombSectorIndex)) {
            bombPositions.push(randomBombSectorIndex);

            randomBombSectorIndex--;

            const topOfBombSector = randomBombSectorIndex - numberOfRowsAndColumns , bottomOfBombSector = randomBombSectorIndex + numberOfRowsAndColumns , leftOfBombSector = randomBombSectorIndex - 1 , rightOfBombSector = randomBombSectorIndex + 1;
            const topLeftOfBombSector = topOfBombSector - 1 , topRightOfBombSector = topOfBombSector + 1 , bottomLeftOfBombSector = bottomOfBombSector - 1 , bottomRightOfBombSector = bottomOfBombSector + 1;

            // Increasing of 1 the counter for every sector near the current bomb div
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
    
    // Creating the sectors that compose the landfield
    for (let i = 0 ; i < numberOfSectors ; i++) {
        // Creating the sector
        const minefieldSector = createElementWithClass('div' , 'minefield-sector');
        // Assign the index to the sector as a data attribute
        minefieldSector.setAttribute('data-sector-index' , i + 1);
        
        minefieldSector.addEventListener('click' , function () {
            const self = this;

            self.classList.add('checked');

            if(bombPositions.includes(parseInt(self.dataset.sectorIndex))) {
                // Changing the style of the div to represnt exploaded bomb
                self.classList.add('exploded');
                // Disabling the possibility to click more sectors
                minefield.style.pointerEvents = 'none';
            } else {
                // Changing the style of the div to represnt checking it
                self.classList.add(`bombs-in-proximity-${proxyBombsCounters[i]}`);
                // Printing how many bombs are near the sector
                self.innerHTML = proxyBombsCounters[i];
                // Increasing the score and printing it in the score section
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