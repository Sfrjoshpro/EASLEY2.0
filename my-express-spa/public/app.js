// Function to load content based on the URL fragment
function loadContent(fragmentId) {
  const content = document.getElementById('content');

  

  // Add a button to the content
  content.innerHTML += '<button id="myButton" class="btn btn-primary">Click Me</button>';

  // Handle button click
  const button = document.getElementById('myButton');
  button.addEventListener('click', function () {
      alert('YAY!')
  });
}

// Function to handle navigation
function navigate() {
  const fragmentId = location.hash.substr(1);
  loadContent(fragmentId);
}

// Event listener for navigation
window.addEventListener('hashchange', navigate);

// Initial page load
navigate();
