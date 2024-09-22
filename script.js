const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

let painting = false;
let brushType = 'pencil';
let brushColor = '#000000';
let brushSize = 5;
let eraserSize = 10;
let eraserActive = false; // Track the state of the eraser

function startPosition(e) {
    painting = true;
    draw(e);
}

function endPosition() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushType === 'eraser' ? eraserSize : brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushType === 'eraser' ? '#FFFFFF' : brushColor;

    ctx.globalCompositeOperation = brushType === 'eraser' ? 'destination-out' : 'source-over';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

document.getElementById('brushSelect').addEventListener('change', (e) => {
    brushType = e.target.value;
    ctx.globalCompositeOperation = 'source-over';
    highlightSelectedElement(e.target);
    deactivateEraser(); // Deactivate eraser when selecting a brush
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
    brushColor = e.target.value;
});

document.getElementById('sizeSlider').addEventListener('input', (e) => {
    brushSize = e.target.value;
    document.getElementById('sizeValue').textContent = brushSize;
});

document.getElementById('eraserButton').addEventListener('click', () => {
    eraserActive = !eraserActive; // Toggle eraser state
    if (eraserActive) {
        brushType = 'eraser';
        ctx.globalCompositeOperation = 'destination-out';
        highlightSelectedElement(document.getElementById('eraserButton'));
        document.getElementById('eraserButton').classList.add('active'); // Add glowing effect
    } else {
        deactivateEraser();
    }
});

// Function to handle button glowing effect
function setActiveButton(button) {
    const buttons = document.querySelectorAll('.toolbar button');
    buttons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
    button.classList.add('active'); // Add active class to the clicked button
}

document.getElementById('clearButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setActiveButton(document.getElementById('clearButton')); // Set active class for clear button
});

function deactivateEraser() {
    eraserActive = false;
    brushType = 'pencil'; // Switch back to pencil
    ctx.globalCompositeOperation = 'source-over';
    document.getElementById('eraserButton').classList.remove('active'); // Remove glowing effect
}

const colors = document.querySelectorAll('.color');

colors.forEach(color => {
    color.addEventListener('click', () => {
        brushColor = color.dataset.color;
        document.getElementById('colorPicker').value = brushColor; // Update color picker
        highlightSelectedElement(color);
    });
});

function highlightSelectedElement(element) {
    colors.forEach(color => color.classList.remove('selected')); // Remove glow from all colors
    element.classList.add('selected'); // Add glow to the selected element
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
