window.onload = function(){
    setTimeout(function() {
        let filledRadioIndex = -1;
        let radioBias = 0;
        let randomPercentage = 0;

        if(hasMultipleSets())
            initAutoQuestionnaire();


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
            const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            const uniqueNames = new Set(Array.from(inputs).map(input => input.name));

            return uniqueNames.size > 1;
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

        function createUI() {
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

            createButtons(container);
            

            container.appendChild(createBiasSlider());
            container.appendChild(createRandomnessSlider());

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
    }, 2000);
    
}
