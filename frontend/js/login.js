// handels login form submissions
async function login() {
  const msg = document.getElementById('message');
  
  //get the email and password from the form
  const data = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  };

  //validation
  if (!data.email || !data.password) {
    msg.style.color = 'red';
    msg.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    //sends the login details to the backend
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      //save the token, name and user id to local storage for the other pages to use
      localStorage.setItem('token', result.token);
      localStorage.setItem('name', result.name);
      localStorage.setItem('userId', result.userId);
      msg.style.color = 'green';
      msg.textContent = 'Login successful! Redirecting...';
      setTimeout(() => window.location.href = 'home.html', 1500); //redirect after 1.5 secs
    }
    else {
      msg.style.color = 'red';
      msg.textContent = result.error;
    }
  } catch (err) {
    msg.style.color = 'red';
    msg.textContent = 'Could not connect to server.';
  }
}