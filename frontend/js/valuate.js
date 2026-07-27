//sends car details to the backend and show ai response
async function valuateCar() {
  const result = document.getElementById('result');

  //collects all form values into a single object
  const data = {
    make: document.getElementById('make').value.trim(),
    model: document.getElementById('model').value.trim(),
    year: document.getElementById('year').value.trim(),
    mileage: document.getElementById('mileage').value.trim(),
    fuelType: document.getElementById('fuelType').value,
    transmission: document.getElementById('transmission').value,
    bodyType: document.getElementById('bodyType').value,
    engineSize: document.getElementById('engineSize').value.trim(),
    trim: document.getElementById('trim').value.trim(),
    condition: document.getElementById('condition').value,
    colour: document.getElementById('colour').value.trim(),
    previousOwners: document.getElementById('previousOwners').value.trim(),
    serviceHistory: document.getElementById('serviceHistory').value,
    nct: document.getElementById('nct').value,
    notes: document.getElementById('notes').value.trim()
  };

  //make, model and year validation
  if (!data.make || !data.model || !data.year) {
    result.style.color = 'red';
    result.textContent = 'Please fill in at least make, model and year.';
    return;
  }

  result.style.color = '#666';
  result.textContent = 'Getting AI estimate, please wait...';

  try {
    //sends the car data to the backend
    const res = await fetch('http://localhost:5000/api/valuate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) //converts data object to json
    });

    const json = await res.json();

    if (res.ok) {
      result.style.color = '#333';
      result.textContent = json.result; //shows ai response 
    } else {
      result.style.color = 'red';
      result.textContent = 'Error: ' + json.error;
    }
  } catch (err) {
    result.style.color = 'red';
    result.textContent = 'Could not connect to server.';
  }
}