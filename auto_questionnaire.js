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
