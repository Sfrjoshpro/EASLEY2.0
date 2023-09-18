// Function to load user profile information
function loadUserProfile() {
  fetch('/profile')
    .then((response) => response.json())
    .then((userData) => {
      const profileContainer = document.getElementById('profileContainer');
      profileContainer.innerHTML = `
        <h1>Welcome, ${userData.displayName}</h1>
        <img src="${userData.photos[0].value}" alt="Profile Picture">
        <p>Email: ${userData.emails[0].value}</p>
      `;
    })
    .catch((error) => {
      console.error('Error loading user profile:', error);
    });
}

// Load user profile information when the page loads
window.addEventListener('load', loadUserProfile);
