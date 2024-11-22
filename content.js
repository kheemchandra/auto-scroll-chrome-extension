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
    let scrollSpeed = 0.6;
    let scrollAccumulator = 0; // To accumulate fractional scroll amounts
    let isScrolling = false;
    let toggleButton, speedDisplay; // Declare variables here


    function toggleScrolling() {
        if (isScrolling) {
            pauseScrolling();
        } else {
            startScrolling();
        }
    }

    function startScrolling() {
        if (isScrolling) return;
        isScrolling = true;
        scrollInterval = setInterval(() => {
            scrollAccumulator += scrollSpeed;
            const scrollAmount = Math.floor(scrollAccumulator);
            scrollAccumulator -= scrollAmount;
            window.scrollBy(0, scrollAmount);
        }, 30); // Adjust interval for smoothness

        toggleButton.innerHTML = `<i class="fas fa-pause"></i>`; // Pause icon
        updateSpeedDisplay();
    }

    function pauseScrolling() {
        if (!isScrolling) return;
        isScrolling = false;
        clearInterval(scrollInterval);
        scrollInterval = null;
        toggleButton.innerHTML = `<i class="fas fa-play"></i>`; // Play icon
        updateSpeedDisplay();
    }

    function increaseSpeed() {
        scrollSpeed = Math.min(scrollSpeed + 0.1, 10);
        updateSpeedDisplay();
    }

    function decreaseSpeed() {
        scrollSpeed = Math.max(scrollSpeed - 0.1, 0.01);
        updateSpeedDisplay();
    }

    function updateSpeedDisplay() {
        if (speedDisplay) {
            speedDisplay.textContent = `${scrollSpeed.toFixed(1)}x`;
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

    toggleButton = document.createElement('button'); // Single toggle button
    toggleButton.innerHTML = `<i class="fas fa-play"></i>`; // Initial play icon
    toggleButton.classList.add('autoscroll-button', 'autoscroll-toggle');
    toggleButton.onclick = toggleScrolling;

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

      panel.appendChild(toggleButton);      // Add the toggle button
        panel.appendChild(controlsContainer);

        document.body.appendChild(panel);
  }
  createPanel();
})();