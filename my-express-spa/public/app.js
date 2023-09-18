// Function to load content based on the URL fragment
function loadContent(fragmentId) {
  const content = document.getElementById('content');

  // Add a button to the content
  content.innerHTML += '<button id="myButton" class="btn btn-primary">Click Me</button>';

  // Handle button click
  const button = document.getElementById('myButton');
  button.addEventListener('click', function () {
    alert('YAY!');
  });
}

// Function to handle navigation
function navigate() {
  const fragmentId = location.hash.substr(1);

  // Check if the fragment is 'profile'
  if (fragmentId === 'profile') {
    // Load profile.html
    loadProfileHtml();
  } else {
    // Load other content
    loadContent(fragmentId);
  }
}

// Function to load profile.html
function loadProfileHtml() {
  fetch('/profile.html')
    .then((response) => response.text())
    .then((html) => {
      const content = document.getElementById('content');
      content.innerHTML = html;
    });
}

// Event listener for navigation
window.addEventListener('hashchange', navigate);

// Initial page load
navigate();

// Add event listener for the "Login with Google" button
const googleLoginBtn = document.getElementById('googleLoginBtn');
googleLoginBtn.addEventListener('click', () => {
  // Redirect the user to the Google OAuth authentication URL
  window.location.href = '/auth/google';
});
