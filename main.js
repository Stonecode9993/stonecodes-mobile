// Mobile menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active")
    })
  }

  // Newsletter form submission
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value
      alert(`Thank you for subscribing with ${email}! You'll receive our latest updates soon.`)
      this.reset()
    })
  }

  // Load cart count from localStorage
  updateCartCount()
})

// Cart functionality
function updateCartCount() {
  const cartCountElements = document.querySelectorAll("#cart-count")
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  cartCountElements.forEach((element) => {
    element.textContent = itemCount
  })
}

// Sample product data
const products = [
  {
    id: 1,
    name: "Galaxy S23 Ultra",
    price: 999.99,
    category: "smartphones",
    image: "images/phone1.jpg",
    description: "The latest Samsung flagship with advanced camera system and S Pen support.",
  },
  {
    id: 2,
    name: "iPhone 14 Pro",
    price: 1099.99,
    category: "smartphones",
    image: "images/phone2.jpg",
    description: "Apple's premium smartphone with dynamic island and powerful A16 chip.",
  },
  {
    id: 3,
    name: "Pixel 7 Pro",
    price: 899.99,
    category: "smartphones",
    image: "images/phone3.jpg",
    description: "Google's flagship with the best camera and AI features.",
  },
  {
    id: 4,
    name: "OnePlus 11",
    price: 799.99,
    category: "smartphones",
    image: "images/phone4.jpg",
    description: "Fast and smooth performance with Hasselblad camera system.",
  },
  {
    id: 5,
    name: "Xiaomi 13 Pro",
    price: 899.99,
    category: "smartphones",
    image: "images/phone5.jpg",
    description: "Feature-packed smartphone with Leica optics.",
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    price: 149.99,
    category: "accessories",
    image: "images/accessory1.jpg",
    description: "True wireless earbuds with active noise cancellation.",
  },
  {
    id: 7,
    name: "Fast Wireless Charger",
    price: 49.99,
    category: "accessories",
    image: "images/accessory2.jpg",
    description: "15W wireless charging pad compatible with all Qi-enabled devices.",
  },
  {
    id: 8,
    name: "Premium Phone Case",
    price: 29.99,
    category: "accessories",
    image: "images/accessory3.jpg",
    description: "Durable and stylish case with drop protection.",
  },
  {
    id: 9,
    name: "Smartwatch Pro",
    price: 299.99,
    category: "wearables",
    image: "images/wearable1.jpg",
    description: "Advanced smartwatch with health tracking and cellular connectivity.",
  },
  {
    id: 10,
    name: "Fitness Tracker",
    price: 129.99,
    category: "wearables",
    image: "images/wearable2.jpg",
    description: "Lightweight fitness band with heart rate monitoring and sleep tracking.",
  },
]

// Save products to localStorage if not already there
if (!localStorage.getItem("products")) {
  localStorage.setItem("products", JSON.stringify(products))
}

// Format currency
function formatCurrency(amount) {
  return "$" + amount.toFixed(2)
}

// Add a function to handle "View Details" clicks on the home page
function viewProductDetails(productId) {
  // Store the selected product ID in localStorage
  localStorage.setItem("selectedProductId", productId)
  // Redirect to the shop page
  window.location.href = "shop.html"
}
