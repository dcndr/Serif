text = document.getElementById("text");
textdata = localStorage.getItem("text")
timestampDisplay = document.getElementById("timestampDisplay")

const placeholders = [
    "In a galaxy far, far away...",
    "Once upon a time...",
    "Knock knock?",
    "Write something... *crickets*",
    "We're reaching out about your car's extended warranty..."
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


