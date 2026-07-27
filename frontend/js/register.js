//handels the register form submissions
async function register() {
      const msg = document.getElementById('message');
      
      //get name, email and password from the form
      const data = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      };

      //validation 
      if (!data.name || !data.email || !data.password) {
        msg.style.color = 'red';
        msg.textContent = 'Please fill in all fields.';
        return;
      }

      try {
        //send the register details to the backedn
        const res = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        if (res.ok) {
          msg.style.color = 'green';
          msg.textContent = 'Account created! Redirecting to login...';
          setTimeout(() => window.location.href = 'login.html', 1500);
        } else {
          msg.style.color = 'red';
          msg.textContent = result.error;
        }
      } catch (err) {
        msg.style.color = 'red';
        msg.textContent = 'Could not connect to server.';
      }
    }