
// Function to fetch and display the menu
// Fetch Menu from Swiggy JSON
function getMenu() {
    const restaurant = document.getElementById("fname").value;
    console.log("Fetching menu for:", restaurant);

    fetch("swiggy_menu.json")
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById("menuContainer");
            menuContainer.innerHTML = ""; // Clear previous items

            data.forEach(item => {
                const menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");

                let price = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0; // Extract valid number

                menuItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <p class="price">₹${price.toFixed(2)}</p>
                    <p>${item.description || "No description available."}</p>
                    <p class="rating">⭐ ${item.rating !== "No Rating" ? item.rating : "N/A"}</p>
                    <button class="selected" onclick="addToCart('${item.name}', ${price})">Add</button>
                `;

                menuContainer.appendChild(menuItem);
            });
        })
        .catch(error => console.error("Error loading menu:", error));
}

// Add Item to Cart and Store in LocalStorage
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let newItem = {
        name: name,
        price: Number(price) || 0, // Ensure price is a valid number
        id: new Date().getTime() // Unique ID for each item
    };

    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Added to cart:", newItem);
    alert(`${name} added to cart!`);
}

// Load Cart and Display Items in cartSection.html
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Cart data:", cart);

    const cartContainer = document.getElementById("addedData");

    if (!cartContainer) {
        console.error("Cart container not found!");
        return;
    }

    cartContainer.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Cart is empty.</p>";
        return;
    }

    cart.forEach((item) => {
        let price = Number(item.price) || 0; // Ensure valid price

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <h2>${item.name}</h2>
            <p>Price: ₹${price.toFixed(2)}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;

        cartContainer.appendChild(div);
    });

    // Calculate total price
    let totalPrice = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
    let totalElement = document.createElement("div");
    totalElement.innerHTML = `<h2>Total: ₹${totalPrice.toFixed(2)}</h2>`;
    cartContainer.appendChild(totalElement);

    // Clear Cart Button
    let clearButton = document.createElement("button");
    clearButton.innerText = "Clear Cart";
    clearButton.onclick = clearCart;
    cartContainer.appendChild(clearButton);
}

// Remove Item from Cart
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.id !== id); // Remove by unique ID
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}

// Clear Entire Cart
function clearCart() {
    localStorage.removeItem("cart");
    loadCart(); // Refresh cart view
}

// Navigate to Cart Page
function viewCart() {
    window.location.href = "cartSection.html";
}

// Function to Print Cart Data on Page Load
function printCartData() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    console.log("Cart Contents:");
    
    if (cart.length === 0) {
        console.log("Cart is empty.");
        return;
    }

    cart.forEach((item, index) => {
        let price = Number(item.price) || 0; // Ensure price is valid

        console.log(`Item ${index + 1}:`);
        console.log(`  Name: ${item.name}`);
        console.log(`  Price: ₹${price.toFixed(2)}`);
        console.log(`  ID: ${item.id}`);
    });
}

// Run this function when cartSection.html loads
window.onload = function() {
    if (window.location.pathname.includes("cartSection.html")) {
        printCartData();
        loadCart(); // Ensure cart items are also displayed on the page
    }
};
