document.getElementById("start-sorting").addEventListener("click", toggleStartStopButton);

// document.getElementById("start-sorting").addEventListener("click", startSorting);
document.getElementById("speed-slider").addEventListener("input", updateSpeedLabel);

// Sound Class 
const audioContext = new (window.AudioContext || window.AudioContext)();



// Add a global variable to track the sorting state (true for "Start", false for "Stop")
let isSorting = false;

let sortingCancelled = false;
let sortingPromise = null;



// Add a global variable to track the mute state (true for muted, false for unmuted)
let isMuted = false;

// Function to toggle the mute state
document.getElementById("mute-sound").addEventListener("change", () => {
    isMuted = document.getElementById("mute-sound").checked;
});


function startSorting() {
    if (sortingPromise) {
        sortingCancelled = true; // Cancel the previous sorting
        sortingPromise.then(() => {
            sortingCancelled = false; // Reset the cancel flag
            // startNewSorting(); // Assuming there is a function named startNewSorting
        });
    } else {
        initiateSorting(); // Call the renamed function
    }
}

function initiateSorting() { // Renamed function
    sortingPromise = null; // Reset the sortingPromise
    if (sortingCancelled) {
        sortingCancelled = false; // Reset the cancel flag
    }

    const selectedAlgorithm = document.getElementById("algorithm").value;
    const container = document.getElementById("sort-container");
    const speed = document.getElementById("speed-slider").value;

    clearBars(container);
    createRandomBars(container);

    const algorithmFunctions = {
        bubble: bubbleSort,
        shell: shellSort,
        insertion: insertionSort,
        selection: selectionSort,
        quick: quickSort,
        merge: mergeSort,
        heap: heapSort,
        // Add more sorting algorithms here
    };

    const algorithmFunction = algorithmFunctions[selectedAlgorithm];

    if (algorithmFunction) {
        sortingPromise = algorithmFunction(container, speed);
        sortingPromise.then(() => {
            sortingPromise = null; // Reset the promise
        });
    }
}


// Function to toggle the sorting state and update the button's text and color
function toggleStartStopButton() {
    const startStopButton = document.getElementById("start-sorting");
    if (isSorting) {
        // Change to "Start" state
        startStopButton.textContent = "Start Sorting";
        startStopButton.style.backgroundColor = "#009e05"; // Green
        startSorting(); // Add a function to stop sorting
    } else {
        // Change to "Stop" state
        startStopButton.textContent = "Stop Sorting";
        startStopButton.style.backgroundColor = "#FF4136"; // Red
        startSorting(); // Add a function to start sorting
    }
    isSorting = !isSorting; // Toggle the sorting state
}



function updateSpeedLabel() {
    const speed = document.getElementById("speed-slider").value;
    document.getElementById("speed-label").textContent = `${speed}ms`;
}


function clearBars(container) {
    container.innerHTML = "";
}

function createRandomBars(container) {
    const numBars = 50; // You can adjust the number of bars
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        const height = Math.floor(Math.random() * 250) + 50; // Adjust the height range
        bar.style.height = `${height}px`;
        container.appendChild(bar);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSpeedLabel() {
    const speed = document.getElementById("speed-slider").value;
    document.getElementById("speed-label").textContent = `${speed}ms`;
}


// Modify the playSound function to check the mute state before playing sound
function playSound(audioContext, frequency) {
    if (!isMuted) {
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine"; // You can change the wave type as needed
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05); // Adjust the duration of the sound
    }
}


async function bubbleSort(container, speed) {
    const bars = container.querySelectorAll(".bar");
    const numBars = bars.length;
    for (let i = 0; i < numBars - 1; i++) {
        for (let j = 0; j < numBars - i - 1; j++) {

            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }
            const bar1 = bars[j];
            const bar2 = bars[j + 1];
            bar1.style.backgroundColor = "#FF4136"; // Highlight the bars being compared
            bar2.style.backgroundColor = "#FF4136";
            await sleep(speed); // Adjust the animation speed
            const height1 = parseInt(bar1.style.height);
            const height2 = parseInt(bar2.style.height);
            if (height1 > height2) {
                const tempHeight = bar1.style.height;
                bar1.style.height = bar2.style.height;
                bar2.style.height = tempHeight;

                // Play a sound after the bars are swapped
                const frequency = 10 + (j * 10); // Adjust the initial frequency and increment as needed
                playSound(audioContext, frequency);
            }
            bar1.style.backgroundColor = "#333"; // Reset the color
            bar2.style.backgroundColor = "#333";
        }
    }

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }

}










async function insertionSort(container, speed) {
    const bars = container.querySelectorAll(".bar");
    const numBars = bars.length;

    for (let i = 1; i < numBars; i++) {
        const currentBar = bars[i];
        const currentHeight = parseInt(currentBar.style.height);
        let j = i - 1;

        currentBar.style.backgroundColor = "#FF4136"; // Highlight the current element being considered

        while (j >= 0 && parseInt(bars[j].style.height) > currentHeight) {
            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }

            bars[j + 1].style.height = bars[j].style.height;
            bars[j].style.backgroundColor = "#FF851B"; // Highlight the element being moved
            await sleep(speed);
            // Move the color reset here
            bars[j].style.backgroundColor = "#333"; // Reset the color
            j--;
        }

        bars[j + 1].style.height = `${currentHeight}px`;
        currentBar.style.backgroundColor = "#01FF70"; // Highlight the sorted element

        // Play a sound after the bars are swapped
        const frequency = 10 + (j * 10); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);

        await sleep(speed);
        currentBar.style.backgroundColor = "#333"; // Reset the color
    }

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }
}







async function selectionSort(container, speed) {
    const bars = container.querySelectorAll(".bar");
    const numBars = bars.length;

    for (let i = 0; i < numBars - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < numBars; j++) {
            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }

            bars[j].style.backgroundColor = "#FF4136"; // Highlight the current comparison
            await sleep(speed);

            const minHeight = parseInt(bars[minIndex].style.height);
            const currentHeight = parseInt(bars[j].style.height);

            if (currentHeight < minHeight) {
                if (minIndex !== i) {
                    bars[minIndex].style.backgroundColor = "#333"; // Reset the color of the previously highlighted minimum bar
                }
                minIndex = j;
            } else {
                bars[j].style.backgroundColor = "#333"; // Reset the color
            }
        }

        if (minIndex !== i) {
            // Swap the bars
            const tempHeight = bars[i].style.height;
            bars[i].style.height = bars[minIndex].style.height;
            bars[minIndex].style.height = tempHeight;
        }

        bars[i].style.backgroundColor = "#01FF70"; // Highlight the sorted element

        // Play a sound after the bars are swapped
        const frequency = 10 + (i * 10); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);

        await sleep(speed);

    }

    // Reset the color of all bars
    bars.forEach(bar => {
        bar.style.backgroundColor = "#333";
    });

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(20); // Adjust the animation speed
    }
}



async function shellSort(container, speed) {
    const bars = container.querySelectorAll(".bar");
    const numBars = bars.length;

    for (let gap = Math.floor(numBars / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < numBars; i++) {
            const tempHeight = parseInt(bars[i].style.height);
            let j;
            for (j = i; j >= gap && parseInt(bars[j - gap].style.height) > tempHeight; j -= gap) {
                bars[j].style.backgroundColor = "#FF4136"; // Highlight the bars being compared
                bars[j - gap].style.backgroundColor = "#FF4136";
                await sleep(speed); // Adjust the animation speed
                bars[j].style.height = bars[j - gap].style.height;
                bars[j].style.backgroundColor = "#333"; // Reset the color
                bars[j - gap].style.backgroundColor = "#333";
            }
            bars[j].style.height = `${tempHeight}px`;

            // Play a sound after the bars are swapped
            const frequency = 10 + (j * 10); // Adjust the initial frequency and increment as needed
            playSound(audioContext, frequency);
        }
    }
    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }
}


// Add Quick Sort function
async function quickSort(container, speed) {
    const bars = container.querySelectorAll(".bar");

    async function partition(low, high) {
        const pivot = parseInt(bars[high].style.height);
        bars[high].style.backgroundColor = "#FF4136"; // Highlight pivot bar
        await sleep(speed);

        let i = low - 1;

        for (let j = low; j <= high - 1; j++) {
            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }
            const currentHeight = parseInt(bars[j].style.height);

            bars[j].style.backgroundColor = "#FF851B"; // Highlight current bar being compared
            await sleep(speed);

            if (currentHeight < pivot) {
                i++;
                // Swap bars at positions i and j
                const tempHeight = bars[i].style.height;
                bars[i].style.height = bars[j].style.height;
                bars[j].style.height = tempHeight;
            }

            bars[j].style.backgroundColor = "#333"; // Reset the color
            // Play a sound after the bars are swapped
            const frequency = 10 + (j * 10); // Adjust the initial frequency and increment as needed
            playSound(audioContext, frequency);
        }

        // Swap the pivot bar with the bar at position i+1
        const tempHeight = bars[i + 1].style.height;
        bars[i + 1].style.height = bars[high].style.height;
        bars[high].style.height = tempHeight;

        // Reset colors
        bars[high].style.backgroundColor = "#333";
        bars[i + 1].style.backgroundColor = "#01FF70"; // Highlight the pivot's final position
        await sleep(speed);

        return i + 1;
    }

    async function quickSortRecursive(low, high) {
        if (low < high) {
            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }

            const pivotIndex = await partition(low, high);

            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }

            await quickSortRecursive(low, pivotIndex - 1);

            if (sortingCancelled) {
                return; // Exit the sorting function if sorting is cancelled
            }

            await quickSortRecursive(pivotIndex + 1, high);
        }
    }

    const numBars = bars.length;
    await quickSortRecursive(0, numBars - 1);

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }
}










// Add Merge Sort function
async function mergeSort(container, speed) {
    const bars = container.querySelectorAll(".bar");

    async function merge(low, mid, high) {
        const leftArray = [];
        const rightArray = [];

        for (let i = low; i <= mid; i++) {
            leftArray.push(parseInt(bars[i].style.height));
        }

        for (let i = mid + 1; i <= high; i++) {
            rightArray.push(parseInt(bars[i].style.height));
        }

        let i = 0;
        let j = 0;
        let k = low;

        while (i < leftArray.length && j < rightArray.length) {
            // Play a sound after the bars are swapped
            const frequency = 10 + (i * 10); // Adjust the initial frequency and increment as needed
            playSound(audioContext, frequency);
            if (leftArray[i] < rightArray[j]) {
                bars[k].style.backgroundColor = "#FF851B"; // Highlight the current bar being compared
                bars[k].style.height = leftArray[i] + "px";
                await sleep(speed);
                bars[k].style.backgroundColor = "#333"; // Reset the color
                i++;
            } else {
                bars[k].style.backgroundColor = "#FF851B"; // Highlight the current bar being compared
                bars[k].style.height = rightArray[j] + "px";
                await sleep(speed);
                bars[k].style.backgroundColor = "#333"; // Reset the color
                j++;
            }
            k++;
        }

        while (i < leftArray.length) {
            bars[k].style.backgroundColor = "#FF851B"; // Highlight the current bar being compared
            bars[k].style.height = leftArray[i] + "px";
            await sleep(speed);
            bars[k].style.backgroundColor = "#333"; // Reset the color
            i++;
            k++;
        }

        while (j < rightArray.length) {
            bars[k].style.backgroundColor = "#FF851B"; // Highlight the current bar being compared
            bars[k].style.height = rightArray[j] + "px";
            await sleep(speed);
            bars[k].style.backgroundColor = "#333"; // Reset the color
            j++;
            k++;
        }
    }

    async function mergeSortRecursive(low, high) {
        if (low < high) {
            const mid = Math.floor((low + high) / 2);
            await mergeSortRecursive(low, mid);
            await mergeSortRecursive(mid + 1, high);
            await merge(low, mid, high);
        }
    }

    const numBars = bars.length;
    await mergeSortRecursive(0, numBars - 1);

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }
}





async function heapSort(container, speed) {
    const bars = container.querySelectorAll(".bar");
    const numBars = bars.length;

    // Build a max heap
    for (let i = Math.floor(numBars / 2) - 1; i >= 0; i--) {
        await heapify(bars, numBars, i, speed);
    }

    // Extract elements one by one from the heap
    for (let i = numBars - 1; i > 0; i--) {
        // Move the current root to the end
        bars[i].style.backgroundColor = "#FF4136"; // Highlight the bar being moved
        await sleep(speed);

        const tempHeight = bars[0].style.height;
        bars[0].style.height = bars[i].style.height;
        bars[i].style.height = tempHeight;

        bars[i].style.backgroundColor = "#01FF70"; // Highlight the sorted element
        // Play a sound after the bars are swapped
        const frequency = 10 + (i * 10); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        await sleep(speed);
        bars[i].style.backgroundColor = "#333"; // Reset the color

        // Call max heapify on the reduced heap
        await heapify(bars, i, 0, speed);
    }

    for (let i = 0; i < numBars; i++) {
        if (sortingCancelled) {
            return; // Exit the sorting function if sorting is cancelled
        }
        const frequency = 10 + (i * 20); // Adjust the initial frequency and increment as needed
        playSound(audioContext, frequency);
        bars[i].style.backgroundColor = "#01FF70";
        await sleep(15); // Adjust the animation speed
    }
}

async function heapify(bars, numBars, i, speed) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < numBars && parseInt(bars[left].style.height) > parseInt(bars[largest].style.height)) {
        largest = left;
    }

    if (right < numBars && parseInt(bars[right].style.height) > parseInt(bars[largest].style.height)) {
        largest = right;
    }

    if (largest !== i) {
        bars[i].style.backgroundColor = "#FF4136"; // Highlight the bar being swapped
        bars[largest].style.backgroundColor = "#FF4136";
        await sleep(speed);

        const tempHeight = bars[i].style.height;
        bars[i].style.height = bars[largest].style.height;
        bars[largest].style.height = tempHeight;

        bars[i].style.backgroundColor = "#333"; // Reset the color
        bars[largest].style.backgroundColor = "#333";

        await heapify(bars, numBars, largest, speed);
    }
}