const API = 'http://localhost:5000/api';

    //opens the lightbox to show full image
    function openLightbox(src) {
      document.getElementById('lightbox-img').src = src; //sets the image source
      document.getElementById('lightbox').classList.add('active'); //show the lightbox
    }

    //close the lightbox when user clicks on it
    function closeLightbox() {
      document.getElementById('lightbox').classList.remove('active');
    }

    //loads a car from the database using the id
    async function loadCar() {
      //url seach params reads the query string from the url - car.html?id-abc123
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id'); //get the car id from the url

      if (!id) {
        document.getElementById('car-detail').innerHTML = '<p>No car ID provided.</p>';
        return;
      }

      try {
        //fetch the car details from the backend using the id
        const res = await fetch(`${API}/cars/${id}`);
        const car = await res.json();

        if (!res.ok) {
          document.getElementById('car-detail').innerHTML = '<p>Car not found.</p>';
          return;
        }

        //fromat date to the irish way
        const date = new Date(car.createdAt).toLocaleDateString('en-IE');

        //build and display the car details html
        document.getElementById('car-detail').innerHTML = `
          <h2 style="margin-bottom: 20px;">${car.year} ${car.make} ${car.model}</h2>

          <div class="car-detail-images">
            ${car.images && car.images.length > 0
              ? car.images.map(img => `
                  <img src="http://localhost:5000/uploads/${img}"
                       alt="${car.make} ${car.model}"
                       onclick="openLightbox('http://localhost:5000/uploads/${img}')">
                `).join('')
              : '<p style="color:#999">No images uploaded.</p>'}
          </div>

          <table class="detail-table">
            <tr><td>Make</td><td>${car.make}</td></tr>
            <tr><td>Model</td><td>${car.model}</td></tr>
            <tr><td>Year</td><td>${car.year}</td></tr>
            <tr><td>Price</td><td>€${car.price.toLocaleString()}</td></tr>
            <tr><td>Mileage</td><td>${car.mileage.toLocaleString()} km</td></tr>
            <tr><td>Contact</td><td>${car.contact}</td></tr>
            <tr><td>Date Posted</td><td>${date}</td></tr>
            ${car.description ? `<tr><td>Description</td><td>${car.description}</td></tr>` : ''}
          </table>
        `;

      } catch (err) {
        document.getElementById('car-detail').innerHTML = '<p>Could not load car details.</p>';
      }
    }

    //loads car as soon as the page opens
    loadCar();