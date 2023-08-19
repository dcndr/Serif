text = document.getElementById("text");
textdata = localStorage.getItem("text")
timestampDisplay = document.getElementById("timestampDisplay")

const placeholders = [
    "In a galaxy far, far away...",
    "Once upon a time...",
    "Knock knock?",
    "Write something... *crickets*",
    "We're reaching out regarding your car's extended warranty..."
];

text.placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];

if (textdata && text.value === "") {
    text.value = textdata

    if (timestampDisplay) {
        const timestamp = parseInt(localStorage.getItem("timestamp"));
        const formattedDate = new Date(timestamp).toLocaleString('en-AU', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            day: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric'
        });
        timestampDisplay.innerHTML = `<button onclick="localStorage.removeItem('text'); location.reload()"><strong style="font-weight: bolder"><span style="text-decoration: underline 3px gray">Serif</span> •</strong></button> ${formattedDate}`;

        if (!textdata) {
            localStorage.removeItem("timestamp")
        }

    }
}
else {
    localStorage.removeItem("timestamp")
    timestampDisplay.style.opacity = '1';
}



text.addEventListener("input", function () {
    const timestamp = new Date().getTime();
    timestampDisplay.style.opacity = '0';
    localStorage.setItem("text",this.value)
    localStorage.setItem("timestamp", timestamp.toString());
});


text.addEventListener("keydown", function (event) {
    if (((event.ctrlKey || event.metaKey) && event.key === "s") && text.value !== "") {
        event.preventDefault();

        const textToSave = text.value;
        const firstLine = textToSave.trim().split("\n")[0];
        const blob = new Blob([textToSave], { type: "text/plain"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `${firstLine}.txt`;
        // Remember to export as .typ when this is an app
        a.click();
    }
});

const searchInput = document.getElementById('searchInput');
const modeDropdown = document.querySelector('.mode-dropdown');
const resultsContainer = document.querySelector('.results');
const spotlight = document.querySelector('.spotlight');
let isSearchOpen = false;
let selectedMode = 'contains:';

// Handle dropdown selection using arrow keys and Enter
let dropdownItems = document.querySelectorAll('.dropdown-item');
let selectedDropdownItem = 0;

function updateDropdownSelection() {
    for (let i = 0; i < dropdownItems.length; i++) {
        if (i === selectedDropdownItem) {
            dropdownItems[i].classList.add('selected');
        } else {
            dropdownItems[i].classList.remove('selected');
        }
    }
}

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value;
    updateResults(searchText);

    if (!searchText.includes(':')) {
        modeDropdown.style.display = 'block';
    } else {
        modeDropdown.style.display = 'none';
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();

        if (isSearchOpen) {
            closeSearch();
        } else {
            openSearch();
        }
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
    }

    if (isSearchOpen && event.key === 'ArrowDown') {
        event.preventDefault();
        selectedDropdownItem = (selectedDropdownItem + 1) % dropdownItems.length;
        updateDropdownSelection();
        selectedMode = dropdownItems[selectedDropdownItem].dataset.mode;
        searchInput.value = selectedMode;
        updateResults(searchInput.value);
    }

    if (isSearchOpen && event.key === 'ArrowUp') {
        event.preventDefault();
        selectedDropdownItem = (selectedDropdownItem - 1 + dropdownItems.length) % dropdownItems.length;
        updateDropdownSelection();
        selectedMode = dropdownItems[selectedDropdownItem].dataset.mode;
        searchInput.value = selectedMode;
        updateResults(searchInput.value);
    }
});

function openSearch() {
    isSearchOpen = true;
    spotlight.classList.add('active');
    searchInput.focus();
    modeDropdown.style.display = 'block';
}

function closeSearch() {
    isSearchOpen = false;
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    spotlight.classList.remove('active');
    modeDropdown.style.display = 'none';
}

function updateResults(searchText) {
    resultsContainer.innerHTML = '';

    const searchMode = getSearchMode(searchText);
    const searchTerm = extractSearchTerm(searchText);
    const textContent = text.value.toLowerCase();
    const words = textContent.split(/\s+/);

    let matchingWords;

    if (searchInput.value !== "") {
        if (searchMode === 'contains:') {
            matchingWords = words.filter(word => word.includes(searchTerm.toLowerCase()));
        } else if (searchMode === 'prefix:') {
            matchingWords = words.filter(word => word.startsWith(searchTerm.toLowerCase()));
        } else if (searchMode === 'matches:') {
            matchingWords = words.filter(word => word === searchTerm.toLowerCase());
        }
    }

    if (matchingWords.length > 0) {
        matchingWords.forEach(word => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.textContent = word;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No matching words found.</p>';
    }
}

function getSearchMode(searchText) {
    const searchModes = ['contains:', 'prefix:', 'matches:'];
    return searchModes.find(mode => searchText.toLowerCase().startsWith(mode));
}

function extractSearchTerm(searchText) {
    return searchText.split(':').slice(1).join(':').trim();
}