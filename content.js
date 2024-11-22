(function() {
    'use strict';

    // Function to load and inject CSS
    function injectCSS(cssPath) {
        const link = document.createElement('link');
        link.href = chrome.runtime.getURL(cssPath);
        link.type = 'text/css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }
    injectCSS('style.css');

    // --- Autoscroll Logic ---
    let scrollInterval;
    let scrollSpeed = 0.8;
    let isScrolling = false;
    let startButton, pauseButton, speedDisplay; // Declare variables here

    let scrollAccumulator = 0; // To accumulate fractional scroll amounts

    function startScrolling() {
        if (isScrolling) return;
        isScrolling = true;
        scrollInterval = setInterval(() => {
            scrollAccumulator += scrollSpeed;
            const scrollAmount = Math.floor(scrollAccumulator); // Get the integer part
            scrollAccumulator -= scrollAmount; // Remove the integer part from the accumulator
            window.scrollBy(0, scrollAmount);
        }, 30);
        updateButtonStates();
        updateSpeedDisplay(); // Ensure speed display is updated when starting
    }

    function pauseScrolling() {
      if (!isScrolling) return;
        isScrolling = false;
      if (scrollInterval) {
          clearInterval(scrollInterval);
          scrollInterval = null; // Reset scrollInterval
      }
        updateButtonStates();
        updateSpeedDisplay(); // Ensure speed display is updated when pausing
    }

    function increaseSpeed() {
        scrollSpeed = Math.min(scrollSpeed + 0.1, 10);
        updateSpeedDisplay();
    }

    function decreaseSpeed() {
        scrollSpeed = Math.max(scrollSpeed - 0.1, 0.01); // Minimum speed: 0.01
        updateSpeedDisplay();
    }

    function updateSpeedDisplay() {
        if (speedDisplay) {
            speedDisplay.textContent = `${scrollSpeed.toFixed(1)}x`; // Show one decimal place
        }
    }

    function updateButtonStates() {
      if(startButton && pauseButton){
          startButton.disabled = isScrolling;
          pauseButton.disabled = !isScrolling;
      }
  }

  function createPanel(){
    // --- UI Element Creation ---
      const panel = document.createElement('div');
      panel.classList.add('autoscroll-panel');

      startButton = document.createElement('button');
      startButton.innerHTML = `<i class="fas fa-play"></i>`;
      startButton.classList.add('autoscroll-button', 'autoscroll-start');
      startButton.onclick = startScrolling;

      pauseButton = document.createElement('button');
      pauseButton.innerHTML = `<i class="fas fa-pause"></i>`;
      pauseButton.classList.add('autoscroll-button', 'autoscroll-pause');
      pauseButton.onclick = pauseScrolling;

      const decreaseButton = document.createElement('button');
      decreaseButton.innerHTML = `<i class="fas fa-minus"></i>`;
      decreaseButton.classList.add('autoscroll-speed-button', 'autoscroll-decrease');
      decreaseButton.onclick = decreaseSpeed;

      speedDisplay = document.createElement('span');
      speedDisplay.textContent = `${scrollSpeed.toFixed(1)}x`;
      speedDisplay.classList.add('autoscroll-speed-display');

      const increaseButton = document.createElement('button');
      increaseButton.innerHTML = `<i class="fas fa-plus"></i>`;
      increaseButton.classList.add('autoscroll-speed-button', 'autoscroll-increase');
      increaseButton.onclick = increaseSpeed;

      const controlsContainer = document.createElement('div');
      controlsContainer.classList.add('autoscroll-controls');
      controlsContainer.appendChild(decreaseButton);
      controlsContainer.appendChild(speedDisplay);
      controlsContainer.appendChild(increaseButton);

      panel.appendChild(startButton);
      panel.appendChild(pauseButton);
      panel.appendChild(controlsContainer);
      document.body.appendChild(panel);

      // Initial button states update
      updateButtonStates();
  }
  createPanel();
})();