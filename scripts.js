document.getElementById('file-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        generatePredictionForm(json);
    };
    
    reader.readAsArrayBuffer(file);
});

function generatePredictionForm(data) {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';  // Clear any existing content

    data.forEach((row, index) => {
        if (index === 0 || row.length < 3) return;  // Skip the header row and any incomplete rows
        
        const matchLabel = `${row[1]}: ${row[2]}`;
        const teams = row[2].split(' v ');
        const teamA = teams[0];
        const teamB = teams[1];
        
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('prediction-question');
        
        const label = document.createElement('label');
        label.textContent = matchLabel;
        
        const select = document.createElement('select');
        select.name = `match${index}`;
        
        const optionA = document.createElement('option');
        optionA.value = `${teamA} Win`;
        optionA.textContent = `${teamA} Win`;
        
        const optionB = document.createElement('option');
        optionB.value = `${teamB} Win`;
        optionB.textContent = `${teamB} Win`;
        
        const optionDraw = document.createElement('option');
        optionDraw.value = 'Draw Match';
        optionDraw.textContent = 'Draw Match';
        
        select.appendChild(optionA);
        select.appendChild(optionB);
        select.appendChild(optionDraw);
        
        questionDiv.appendChild(label);
        questionDiv.appendChild(select);
        
        container.appendChild(questionDiv);
    });

    document.getElementById('prediction-form').style.display = 'block';
}

document.getElementById('prediction-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const results = Array.from(formData.entries()).map(([key, value]) => {
        return `<li>${key}: ${value}</li>`;
    }).join('');

    document.getElementById('results').innerHTML = `<p>You predicted the following winners:</p><ul>${results}</ul>`;
});
