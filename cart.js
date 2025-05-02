document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items")
  const cartEmptyMessage = document.getElementById("cart-empty")
  const cartSummary = document.getElementById("cart-summary")
  const subtotalElement = document.getElementById("cart-subtotal")
  const shippingElement = document.getElementById("cart-shipping")
  const taxElement = document.getElementById("cart-tax")
  const totalElement = document.getElementById("cart-total")
  const checkoutBtn = document.getElementById("checkout-btn")
  const clearCartBtn = document.getElementById("clear-cart-btn")

  // Load cart from localStorage
  loadCart()

  // Event listener for checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Thank you for your order! In a real implementation, you would be redirected to a payment gateway.")
      // Clear the cart after checkout
      localStorage.setItem("cart", JSON.stringify([]))
      updateCartCount()
      loadCart()
    })
  }

  // Event listener for clear cart button
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        localStorage.setItem("cart", JSON.stringify([]))
        updateCartCount()
        loadCart()
      }
    })
  }

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    if (!cartItemsContainer || !cartEmptyMessage || !cartSummary) return

    if (cart.length === 0) {
      cartItemsContainer.style.display = "none"
      cartEmptyMessage.style.display = "block"
      cartSummary.style.display = "none"
      return
    }

    cartItemsContainer.style.display = "block"
    cartEmptyMessage.style.display = "none"
    cartSummary.style.display = "block"

    // Clear previous items
    cartItemsContainer.innerHTML = ""

    // Add each item to the cart display
    cart.forEach((item) => {
      const cartItemElement = document.createElement("div")
      cartItemElement.className = "cart-item"

      cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${formatCurrency(item.price)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <p class="cart-item-total">${formatCurrency(item.price * item.quantity)}</p>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `

      cartItemsContainer.appendChild(cartItemElement)
    })

    // Add event listeners to quantity buttons and remove buttons
    const decreaseButtons = document.querySelectorAll(".decrease-quantity")
    const increaseButtons = document.querySelectorAll(".increase-quantity")
    const removeButtons = document.querySelectorAll(".cart-item-remove")

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        updateQuantity(productId, -1)
      })
    })

    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        updateQuantity(productId, 1)
      })
    })

    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        removeFromCart(productId)
      })
    })

    // Update summary
    updateCartSummary()
  }

  function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const itemIndex = cart.findIndex((item) => item.id === productId)

    if (itemIndex !== -1) {
      cart[itemIndex].quantity += change

      if (cart[itemIndex].quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1)
      }

      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
      loadCart()
    }
  }

  function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const updatedCart = cart.filter((item) => item.id !== productId)

    localStorage.setItem("cart", JSON.stringify(updatedCart))
    updateCartCount()
    loadCart()
  }

  function updateCartSummary() {
    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return

    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    // Calculate shipping (free over $100, otherwise $10)
    const shipping = subtotal > 100 ? 0 : 10

    // Calculate tax (8% of subtotal)
    const tax = subtotal * 0.08

    // Calculate total
    const total = subtotal + shipping + tax

    // Update display
    subtotalElement.textContent = formatCurrency(subtotal)
    shippingElement.textContent = formatCurrency(shipping)
    taxElement.textContent = formatCurrency(tax)
    totalElement.textContent = formatCurrency(total)
  }

  function formatCurrency(number) {
    return "$" + number.toFixed(2)
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []
    const count = cart.reduce((total, item) => total + item.quantity, 0)
    const cartCountElements = document.querySelectorAll("#cart-count")
    cartCountElements.forEach((element) => {
      if (element) {
        element.textContent = count
      }
    })
  }
})
