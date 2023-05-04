document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        selectedNext();
        event.preventDefault();
    } else if (event.key === 'Enter') {
        selectFirstRadioInEachSet();
        event.preventDefault();
    }
});

function selectedNext() {
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    const focusedIndex = Array.from(inputs).findIndex(input => input === document.activeElement);
    let nextSetIndex = -1;

    for (let i = focusedIndex + 1; i < inputs.length; i++) {
        if (focusedIndex === -1 || inputs[i].name !== inputs[focusedIndex].name) {
            nextSetIndex = i;
            break;
        }
    }

    if (nextSetIndex === -1) {
        nextSetIndex = 0;
    }

    if (inputs[nextSetIndex].type === 'radio') {
        const radiosInNextSet = document.getElementsByName(inputs[nextSetIndex].name);
        radiosInNextSet[0].checked = true;
    }
    inputs[nextSetIndex].focus();
}

function selectFirstRadioInEachSet() {
    const inputs = document.querySelectorAll('input[type="radio"]');
    const uniqueNames = new Set(Array.from(inputs).map(input => input.name));

    uniqueNames.forEach(name => {
        const radioGroup = document.getElementsByName(name);
        radioGroup[0].checked = true;
    });
}

(function() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.backgroundColor = 'white';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '4px';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.justifyContent = 'space-around';

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

    document.body.appendChild(container);
})();

