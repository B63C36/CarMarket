const API = 'http://localhost:5000/api';

async function postCar() {
  const msg = document.getElementById('message');

  const data = {
    make: document.getElementById('make').value.trim(),
    model: document.getElementById('model').value.trim(),
    year: parseInt(document.getElementById('year').value),
    price: parseInt(document.getElementById('price').value),
    mileage: parseInt(document.getElementById('mileage').value),
    contact: document.getElementById('contact').value.trim(),
    description: document.getElementById('description').value.trim()
  };

  if (!data.make || !data.model || !data.year || !data.price || !data.mileage || !data.contact) {
    msg.style.color = 'red';
    msg.textContent = 'Please fill in all required fields.';
    return;
  }

  try {
    const res = await fetch(`${API}/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      msg.style.color = 'green';
      msg.textContent = 'Car was listed successfully';
      document.querySelectorAll('input, textarea').forEach(el => el.value = '');
      loadCars();
    } else {
      msg.style.color = 'red';
      msg.textContent = 'Error: ' + result.error;
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Could not connect to server';
  }
}

async function loadCars() {
  const container = document.getElementById('listings-container');
  container.innerHTML = '<p>Loading...</p>';

  try {
    const res = await fetch(`${API}/cars`);
    const cars = await res.json();

    if (cars.length === 0) {
      container.innerHTML = '<p>No cars listed yet.</p>';
      return;
    }

    container.innerHTML = cars.map(car => `
      <div class="car-card">
        <div>
          <div class="car-title">${car.year} ${car.make} ${car.model}</div>
          <div class="car-details">${car.mileage.toLocaleString()} km &nbsp;|&nbsp; ${car.contact}</div>
          ${car.description ? `<div class="car-details">${car.description}</div>` : ''}
        </div>
        <div class="car-price">€${car.price.toLocaleString()}</div>
      </div>
    `).join('');

  } catch (err) {
    container.innerHTML = '<p>Could not load listings.</p>';
  }
}