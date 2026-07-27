const API = 'http://localhost:5000/api'; //base url for all backend api calls

//posts a new car listing to the database
async function postCar() {
  const msg = document.getElementById('message');
  const token = localStorage.getItem('token'); //gets the jwt stored at the login

  //if no token the user not logged in
  if (!token) {
    msg.style.color = 'red';
    msg.textContent = 'You must be logged in to post a car.';
    return;
  }

  //fromdata is used instead of json because files are sent woth text
  const formData = new FormData();
  formData.append('make', document.getElementById('make').value.trim());
  formData.append('model', document.getElementById('model').value.trim());
  formData.append('year', document.getElementById('year').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('mileage', document.getElementById('mileage').value);
  formData.append('contact', document.getElementById('contact').value.trim());
  formData.append('description', document.getElementById('description').value.trim());

  //loop through each image file and add it to the form data
  const imageFiles = document.getElementById('images').files;
  for (let i = 0; i < imageFiles.length; i++) {
    formData.append('images', imageFiles[i]);
  }

  //check if the important fields are filled in
  if (!formData.get('make') || !formData.get('model') || !formData.get('year') || !formData.get('price') || !formData.get('mileage') || !formData.get('contact')) {
    msg.style.color = 'red';
    msg.textContent = 'Please fill in all required fields.';
    return;
  }

  try {
    //sends the post request to the backend with the token in the header
    const res = await fetch(`${API}/cars`, {
      method: 'POST',
      headers: { authorization: token }, //jwt sent in the header for verification
      body: formData
    });

    const result = await res.json();

    if (res.ok) {
      msg.style.color = 'green';
      msg.textContent = 'Car listed successfully.';
      document.querySelectorAll('input, textarea').forEach(el => el.value = '');
      loadCars(); //refresh lisitng
    } else {
      msg.style.color = 'red';
      msg.textContent = 'Error: ' + result.error;
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Could not connect to server.';
  }
}

//deletes car lisiting by id
async function deleteCar(id) {
  //confirmation before deleting
  const confirmed = confirm('Are you sure you want to delete this listing?');
  if (!confirmed) return;

  const token = localStorage.getItem('token');

  try {
    //sends delete request with the car id in the url and token in the header
    const res = await fetch(`${API}/cars/${id}`, {
      method: 'DELETE',
      headers: { authorization: token }
    });

    const result = await res.json();

    if (res.ok) {
      loadCars(); //refereshes after deletes 
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    alert('Could not connect to server.');
  }
}

//loads all car listings from the database and displays them
async function loadCars() {
  const container = document.getElementById('listings-container');
  container.innerHTML = '<p>Loading...</p>';

  const loggedInUserId = localStorage.getItem('userId'); //get the logged in user id from the localstorage

  try {
    const res = await fetch(`${API}/cars`); //get request to get all cars 
    const cars = await res.json();

    if (cars.length === 0) {
      container.innerHTML = '<p>No cars listed yet.</p>';
      return;
    }

    //builds the html for each car card and displays it
    container.innerHTML = cars.map(car => `
      <div class="car-card" onclick="window.location.href='car.html?id=${car._id}'" style="cursor: pointer;">
        <div class="car-images">
          ${car.images && car.images.length > 0
            ? car.images.map(img => `<img src="http://localhost:5000/uploads/${img}" alt="${car.make} ${car.model}">`).join('')
            : ''}
        </div>
        <div style="flex: 1;">
          <div class="car-title">${car.year} ${car.make} ${car.model}</div>
          <div class="car-details">${car.mileage.toLocaleString()} km &nbsp;|&nbsp; ${car.contact}</div>
          ${car.description ? `<div class="car-details">${car.description}</div>` : ''}
        </div>
        <div style="text-align: right;">
          <div class="car-price">€${car.price.toLocaleString()}</div>
          ${car.userId === loggedInUserId ? `<button onclick="deleteCar('${car._id}')" style="margin-top: 8px; background: #c0392b; font-size: 12px; padding: 6px 12px;">Delete Listing</button>` : ''}
        </div>
      </div>
    `).join('');

  } catch (err) {
    container.innerHTML = '<p>Could not load listings.</p>';
  }
}