async function login() {
      const msg = document.getElementById('message');
      const data = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      };

      if (!data.email || !data.password) {
        msg.style.color = 'red';
        msg.textContent = 'Please fill in all fields.';
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('name', result.name);
          msg.style.color = 'green';
          msg.textContent = 'Login successful! Redirecting...';
          setTimeout(() => window.location.href = 'home.html', 1500);
        } else {
          msg.style.color = 'red';
          msg.textContent = result.error;
        }
      } catch (err) {
        msg.style.color = 'red';
        msg.textContent = 'Could not connect to server.';
      }
    }