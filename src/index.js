// Fetch all toys and render them to the DOM when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchToys();
});

// Fetch all toys from the server and render them
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      const toyCollection = document.getElementById("toy-collection");
      toyCollection.innerHTML = ""; // Clear any previous toys
      toys.forEach(toy => {
        renderToy(toy, toyCollection);
      });
    })
    .catch(error => console.error("Error fetching toys:", error));
}

// Function to render a toy as a card in the DOM
function renderToy(toy, toyCollection) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="toy-${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);

  // Add event listener for liking the toy
  const likeButton = card.querySelector(".like-btn");
  likeButton.addEventListener("click", () => increaseLikes(toy));
}

// Handle form submission for adding a new toy
const addToyForm = document.querySelector(".add-toy-form");
const newToyButton = document.getElementById("new-toy-btn");
const toyForm = document.querySelector(".add-toy-form");

// Initially, hide the form
let formVisible = false;
addToyForm.style.display = "none";

// Toggle form visibility when "Add a new toy!" button is clicked
newToyButton.addEventListener("click", () => {
  formVisible = !formVisible;
  addToyForm.style.display = formVisible ? "block" : "none";
});

// Add a new toy via the form
addToyForm.addEventListener("submit", (event) => {
  event.preventDefault();  // Prevent the page from reloading

  const nameInput = event.target.name.value;
  const imageInput = event.target.image.value;

  // Create a new toy object
  const newToy = {
    name: nameInput,
    image: imageInput,
    likes: 0
  };

  // Send a POST request to add the new toy to the server
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(newToy),
  })
  .then(response => response.json())  // Convert the response to JSON
  .then(renderToy)  // Call the renderToy function to add the toy to the DOM
  .catch(error => console.error("Error adding new toy:", error));

  // Reset the form after submitting
  addToyForm.reset();
  addToyForm.style.display = "none";  // Hide the form again
  formVisible = false;  // Update the form visibility state
});

// Function to increase the number of likes for a toy
function increaseLikes(toy) {
  const updatedLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: updatedLikes
    })
  })
  .then(response => response.json())
  .then(updatedToy => {
    // Update the likes in the DOM
    const toyCard = document.getElementById(`toy-${toy.id}`).parentElement;
    const likesParagraph = toyCard.querySelector("p");
    likesParagraph.textContent = `${updatedLikes} Likes`;
  })
  .catch(error => console.error("Error updating likes:", error));
}
