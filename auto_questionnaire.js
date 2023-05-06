let filledRadioIndex = -1;
let radioBias = 0;
let randomPercentage = 0;
let currentGoogleQuestionIndex = 0;

const radioGroups = document.querySelectorAll('[role="radiogroup"]');


if(isGoogleFormsURL())
    initGoogleFormsAutoQuestionnaire();
else if(hasMultipleSets())
    initAutoQuestionnaire();

function initGoogleFormsAutoQuestionnaire(){
    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            selectedGoogleFormNext();
            event.preventDefault();
        } else if (event.key === 'Enter') {
            selectGoogleFormRadioInEachSet();
            event.preventDefault();
        }
    });

    createUI();
}

function initAutoQuestionnaire(){
    document.addEventListener('keydown', function(event) {
        if (event.key === ' ') {
            selectedNext();
            event.preventDefault();
        } else if (event.key === 'Enter') {
            selectRadioInEachSet();
            event.preventDefault();
        }
    });

    createUI();
}

function hasMultipleSets() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    const uniqueNames = new Set(Array.from(inputs).map(input => input.name));

    return uniqueNames.size > 3;
}

function selectedNext() {
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    let nextSetIndex = -1;

    for (let i = filledRadioIndex + 1; i < inputs.length; i++) {
        if (filledRadioIndex === -1 || inputs[i].name !== inputs[filledRadioIndex].name) {
            nextSetIndex = i;
            break;
        }
    }

    if (nextSetIndex === -1) {
        nextSetIndex = 0;
    }

    if (inputs[nextSetIndex].type === 'radio') {
        const radiosInNextSet = document.getElementsByName(inputs[nextSetIndex].name);
        const selectedIndex = getSelectedIndex(radiosInNextSet);
        
        // Create and dispatch a MouseEvent to simulate a mouse click
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        radiosInNextSet[selectedIndex].dispatchEvent(event);
    }
    filledRadioIndex = nextSetIndex;
    inputs[nextSetIndex].focus();
}

function selectRadioInEachSet() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    const uniqueNames = new Set(Array.from(inputs).map(input => input.name));

    uniqueNames.forEach(name => {
        const radioGroup = document.getElementsByName(name);
        const selectedIndex = getSelectedIndex(radioGroup);

        // Create and dispatch a MouseEvent to simulate a mouse click
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        radioGroup[selectedIndex].dispatchEvent(event);
    });
}

function getSelectedIndex(radioGroup) {
    if (Math.random() < (1 - randomPercentage / 100)) {
        return radioBias === 1 ? Math.floor(radioGroup.length / 2) : radioBias === 2 ? radioGroup.length - 1 : 0;
    } else {
        return Math.floor(Math.random() * radioGroup.length);
    }
}

function isGoogleFormsURL() {
    const currentURL = window.location.href;
    const googleFormsURLPattern = /^https:\/\/docs\.google\.com\/forms\/(?:u\/\d\/|d\/)(?:e\/[\w-]+\/(?:viewform)|.+)$/;
    
    return googleFormsURLPattern.test(currentURL);
}

function selectedGoogleFormNext() {

    const radioButtons = radioGroups[currentGoogleQuestionIndex].querySelectorAll('[role="radio"]');

    if (radioButtons && radioButtons.length > 0) {
        const selectedIndex = getSelectedIndex(radioButtons);
        if(!(radioButtons[selectedIndex].getAttribute('aria-checked') && radioButtons[selectedIndex].getAttribute('aria-checked') == "true"))
            radioButtons[selectedIndex].click();

        radioButtons[selectedIndex].focus();
    }
    currentGoogleQuestionIndex++;
    // If there are no more questions, return to top
    if (currentGoogleQuestionIndex >= radioGroups.length) {
        currentGoogleQuestionIndex = 0;
    }
    
}

function selectGoogleFormRadioInEachSet() {
    radioGroups.forEach(group => {
        const radioButtons = group.querySelectorAll('[role="radio"]');
        if (radioButtons && radioButtons.length > 0) {
            const selectedIndex = getSelectedIndex(radioButtons);
            if(!(radioButtons[selectedIndex].getAttribute('aria-checked') && radioButtons[selectedIndex].getAttribute('aria-checked') == "true"))
                radioButtons[selectedIndex].click();
                
            radioButtons[selectedIndex].focus();
        }
    });
}


function createUI() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '4px';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.justifyContent = 'space-around';

    createButtons(container);

    container.appendChild(createBiasSlider());
    container.appendChild(createRandomnessSlider());

    makeDraggable(container);

    document.body.appendChild(container);
};

function createButtons(container){
    const buttonStyles = `
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        color: white;
        cursor: pointer;
        font-size: 14px;
        margin: 0 4px;
        padding: 8px 12px;
        text-align: center;
        text-decoration: none;
        user-select: none;
        opacity: 0.7;
    `;

    const buttons = [
        { title: 'Fill All (Enter)', key: 'Enter' },
        { title: 'Fill Next (Space)', key: ' ' }
    ];

    buttons.forEach(buttonData => {
        const button = document.createElement('button');
        button.innerText = buttonData.title;
        button.style.cssText = buttonStyles;
        button.title = buttonData.title;
        button.addEventListener('click', () => {
            const event = new KeyboardEvent('keydown', { key: buttonData.key });
            document.dispatchEvent(event);
        });
        container.appendChild(button);
    });

}

function createBiasSlider(){
    // Create a new div for the slider and its label
    const sliderDiv = document.createElement('div');
    sliderDiv.style.display = 'flex';
    sliderDiv.style.flexDirection = 'column';
    sliderDiv.style.alignItems = 'center';

    // Create a slider label
    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Bias: <span id="bias-value">First</span>';
    sliderLabel.style.fontSize = '14px';
    sliderLabel.style.marginRight = '8px';

    // Create a slider input
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '2';
    slider.value = '0';
    slider.step = '1';
    slider.style.width = '150px';
    slider.style.marginRight = '10px';
    
    // Update radioBias and label value when slider changes
    slider.addEventListener('input', (event) => {
        radioBias = parseInt(event.target.value);
        var radioBiasTxt;
        switch(radioBias){
            case 0:
                radioBiasTxt = "First";
                break;
            case 1:
                radioBiasTxt = "Middle";
                break;
            case 2:
                radioBiasTxt = "Last";
                break;
        }
        document.getElementById('bias-value').textContent = radioBiasTxt;
    });

    // Add the slider label and input to the container
    sliderDiv.appendChild(sliderLabel);
    sliderDiv.appendChild(slider);

    return sliderDiv;
}

function createRandomnessSlider() {
    const sliderDiv = document.createElement('div');
    sliderDiv.style.display = 'flex';
    sliderDiv.style.flexDirection = 'column';
    sliderDiv.style.alignItems = 'center';

    const sliderLabel = document.createElement('label');
    sliderLabel.innerHTML = 'Randomness: <span id="randomness-value">0%</span>';
    sliderLabel.style.fontSize = '14px';
    sliderLabel.style.marginRight = '8px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = '0';
    slider.step = '1';
    slider.style.width = '150px';
    slider.style.marginRight = '10px';

    slider.addEventListener('input', (event) => {
        randomPercentage = parseInt(event.target.value);
        document.getElementById('randomness-value').textContent = `${randomPercentage}%`;
    });

    sliderDiv.appendChild(sliderLabel);
    sliderDiv.appendChild(slider);

    return sliderDiv;
}

function makeDraggable(container) {
    let isMouseDown = false;
    let initialMouseX, initialMouseY;
    let initialContainerX, initialContainerY;
    
    const sliders = container.querySelectorAll('input[type="range"]');
    
    container.addEventListener('mousedown', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'range') {
        return;
        }
    
        isMouseDown = true;
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
        initialContainerX = container.offsetLeft;
        initialContainerY = container.offsetTop;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!isMouseDown) return;
    
        for (let slider of sliders) {
        const rect = slider.getBoundingClientRect();
        if (rect && typeof rect.contains === 'function' && rect.contains(event.target)) {
            return;
        }
        }
    
        const deltaX = event.clientX - initialMouseX;
        const deltaY = event.clientY - initialMouseY;
    
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
    
        const minX = containerWidth/2;
        const minY = 0;
        const maxX = window.innerWidth - containerWidth/2;
        const maxY = window.innerHeight - containerHeight;
    
        let newContainerX = initialContainerX + deltaX;
        let newContainerY = initialContainerY + deltaY;
    
        newContainerX = Math.max(minX, Math.min(newContainerX, maxX));
        newContainerY = Math.max(minY, Math.min(newContainerY, maxY));
    
        container.style.left = `${newContainerX}px`;
        container.style.top = `${newContainerY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });
    
    window.addEventListener('resize', () => {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
    
        const minX = 0;
        const minY = 0;
        const maxX = window.innerWidth - containerWidth;
        const maxY = window.innerHeight - containerHeight;
    
        let newContainerX = parseInt(container.style.left, 10);
        let newContainerY = parseInt(container.style.top, 10);
    
        newContainerX = Math.max(minX, Math.min(newContainerX, maxX));
        newContainerY = Math.max(minY, Math.min(newContainerY, maxY));
    
        container.style.left = `${newContainerX}px`;
        container.style.top = `${newContainerY}px`;
    });
}