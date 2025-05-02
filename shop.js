document.addEventListener("DOMContentLoaded", () => {
  const productContainer = document.getElementById("product-container")
  const categoryFilter = document.getElementById("category-filter")
  const sortFilter = document.getElementById("sort-filter")
  const prevPageBtn = document.getElementById("prev-page")
  const nextPageBtn = document.getElementById("next-page")
  const pageInfo = document.getElementById("page-info")

  let currentPage = 1
  const productsPerPage = 6
  let filteredProducts = []

  // Get products from localStorage
  const products = JSON.parse(localStorage.getItem("products")) || []

  // Check for URL parameters to filter by category
  const urlParams = new URLSearchParams(window.location.search)
  const categoryParam = urlParams.get("category")

  // Set the category filter based on URL parameter if it exists
  if (categoryParam && categoryFilter) {
    categoryFilter.value = categoryParam
  }

  // Initial load
  filterAndDisplayProducts()

  // Event listeners for filters
  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      currentPage = 1
      filterAndDisplayProducts()
    })
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", () => {
      filterAndDisplayProducts()
    })
  }

  // Pagination event listeners
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        displayProducts()
        updatePaginationControls()
      }
    })
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
      if (currentPage < totalPages) {
        currentPage++
        displayProducts()
        updatePaginationControls()
      }
    })
  }

  // Format currency function
  function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number)
  }

  // Update cart count function
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

  function filterAndDisplayProducts() {
    // Apply category filter
    const selectedCategory = categoryFilter ? categoryFilter.value : "all"
    filteredProducts =
      selectedCategory === "all" ? [...products] : products.filter((product) => product.category === selectedCategory)

    // Apply sort filter
    const selectedSort = sortFilter ? sortFilter.value : "featured"

    switch (selectedSort) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // Assuming newer products have higher IDs
        filteredProducts.sort((a, b) => b.id - a.id)
        break
      default:
        // 'featured' - no specific sorting
        break
    }

    displayProducts()
    updatePaginationControls()
  }

  function displayProducts() {
    if (!productContainer) return

    productContainer.innerHTML = ""

    const startIndex = (currentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    if (paginatedProducts.length === 0) {
      productContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>'
      return
    }

    paginatedProducts.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.className = "product-card"

      productCard.innerHTML = `
                <img src="¢{product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatCurrency(product.price)}</p>
                <p>${product.description.substring(0, 60)}${product.description.length > 60 ? "..." : ""}</p>
                <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `

      productContainer.appendChild(productCard)
    })

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        addToCart(productId)
      })
    })
  }

  function updatePaginationControls() {
    if (!pageInfo || !prevPageBtn || !nextPageBtn) return

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`

    prevPageBtn.disabled = currentPage === 1
    nextPageBtn.disabled = currentPage === totalPages
  }

  function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const cart = JSON.parse(localStorage.getItem("cart")) || []

    const existingItemIndex = cart.findIndex((item) => item.id === productId)

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    // Show confirmation message
    const confirmationMessage = document.createElement("div")
    confirmationMessage.className = "confirmation-message"
    confirmationMessage.textContent = `${product.name} added to cart!`
    document.body.appendChild(confirmationMessage)

    setTimeout(() => {
      confirmationMessage.classList.add("show")
      setTimeout(() => {
        confirmationMessage.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(confirmationMessage)
        }, 300)
      }, 2000)
    }, 10)
  }

  updateCartCount() // Call updateCartCount on page load to display initial cart count
})
