document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form")
  const loginError = document.getElementById("login-error")
  const adminLogin = document.getElementById("admin-login")
  const adminDashboard = document.getElementById("admin-dashboard")
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")
  const addProductBtn = document.getElementById("add-product-btn")
  const productForm = document.getElementById("product-form")
  const addProductForm = document.getElementById("add-product-form")
  const cancelProductBtn = document.getElementById("cancel-product-btn")
  const formTitle = document.getElementById("form-title")
  const productTableBody = document.getElementById("product-table-body")
  const ordersTableBody = document.getElementById("orders-table-body")
  const customersTableBody = document.getElementById("customers-table-body")

  // Admin credentials (in a real app, this would be handled server-side)
  const adminCredentials = {
    username: "Stonecode",
    password: "5230100245",
  }

  // Function to format currency
  function formatCurrency(number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number)
  }

  // Check if already logged in
  const isLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true"
  if (isLoggedIn) {
    showAdminDashboard()
  }

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      if (username === adminCredentials.username && password === adminCredentials.password) {
        sessionStorage.setItem("adminLoggedIn", "true")
        showAdminDashboard()
      } else {
        if (loginError) {
          loginError.textContent = "Invalid username or password"
        }
      }
    })
  }

  // Tab switching
  if (tabButtons) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabName = this.getAttribute("data-tab")

        // Update active tab button
        tabButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")

        // Show selected tab content
        tabContents.forEach((content) => {
          content.classList.remove("active")
          if (content.id === tabName + "-tab") {
            content.classList.add("active")
          }
        })

        // Load tab data
        if (tabName === "products") {
          loadProducts()
        } else if (tabName === "orders") {
          loadOrders()
        } else if (tabName === "customers") {
          loadCustomers()
        }
      })
    })
  }

  // Add product button
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      resetProductForm()
      if (formTitle) formTitle.textContent = "Add New Product"
      if (productForm) productForm.style.display = "block"
    })
  }

  // Cancel product button
  if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", () => {
      if (productForm) productForm.style.display = "none"
    })
  }

  // Add/Edit product form submission
  if (addProductForm) {
    addProductForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const productId = document.getElementById("product-id").value
      const name = document.getElementById("product-name").value
      const price = Number.parseFloat(document.getElementById("product-price").value)
      const category = document.getElementById("product-category").value
      const image = document.getElementById("product-image").value
      const description = document.getElementById("product-description").value

      const products = JSON.parse(localStorage.getItem("products")) || []

      if (productId) {
        // Edit existing product
        const index = products.findIndex((p) => p.id === Number.parseInt(productId))
        if (index !== -1) {
          products[index] = {
            ...products[index],
            name,
            price,
            category,
            image,
            description,
          }
        }
      } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
        products.push({
          id: newId,
          name,
          price,
          category,
          image,
          description,
        })
      }

      localStorage.setItem("products", JSON.stringify(products))

      if (productForm) productForm.style.display = "none"
      loadProducts()

      // Show confirmation message
      alert(productId ? "Product updated successfully!" : "Product added successfully!")
    })
  }

  // Initial load of products tab
  loadProducts()

  function showAdminDashboard() {
    if (adminLogin) adminLogin.style.display = "none"
    if (adminDashboard) adminDashboard.style.display = "block"

    // Load products tab by default
    loadProducts()
  }

  function loadProducts() {
    if (!productTableBody) return

    const products = JSON.parse(localStorage.getItem("products")) || []

    productTableBody.innerHTML = ""

    products.forEach((product) => {
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.category}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `

      productTableBody.appendChild(row)
    })

    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll(".edit-btn")
    const deleteButtons = document.querySelectorAll(".delete-btn")

    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        editProduct(productId)
      })
    })

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number.parseInt(this.getAttribute("data-id"))
        deleteProduct(productId)
      })
    })
  }

  function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem("products")) || []
    const product = products.find((p) => p.id === productId)

    if (product) {
      document.getElementById("product-id").value = product.id
      document.getElementById("product-name").value = product.name
      document.getElementById("product-price").value = product.price
      document.getElementById("product-category").value = product.category
      document.getElementById("product-image").value = product.image
      document.getElementById("product-description").value = product.description

      if (formTitle) formTitle.textContent = "Edit Product"
      if (productForm) productForm.style.display = "block"
    }
  }

  function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
      let products = JSON.parse(localStorage.getItem("products")) || []
      products = products.filter((p) => p.id !== productId)
      localStorage.setItem("products", JSON.stringify(products))
      loadProducts()
    }
  }

  function resetProductForm() {
    document.getElementById("product-id").value = ""
    document.getElementById("product-name").value = ""
    document.getElementById("product-price").value = ""
    document.getElementById("product-category").value = "smartphones"
    document.getElementById("product-image").value = ""
    document.getElementById("product-description").value = ""
  }

  function loadOrders() {
    if (!ordersTableBody) return

    // Sample orders data (in a real app, this would come from a database)
    const orders = [
      {
        id: "ORD-1001",
        customer: "John Smith",
        date: "2025-04-28",
        total: 1249.98,
        status: "Delivered",
      },
      {
        id: "ORD-1002",
        customer: "Sarah Johnson",
        date: "2025-04-29",
        total: 349.97,
        status: "Processing",
      },
      {
        id: "ORD-1003",
        customer: "Michael Brown",
        date: "2025-04-30",
        total: 899.99,
        status: "Shipped",
      },
    ]

    ordersTableBody.innerHTML = ""

    orders.forEach((order) => {
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatCurrency(order.total)}</td>
                <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `

      ordersTableBody.appendChild(row)
    })

    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll(".view-btn")
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const orderId = this.getAttribute("data-id")
        alert(`Viewing details for order ${orderId}. In a real implementation, this would show order details.`)
      })
    })
  }

  function loadCustomers() {
    if (!customersTableBody) return

    // Sample customers data (in a real app, this would come from a database)
    const customers = [
      {
        id: 1,
        name: "John Smith",
        email: "john.smith@example.com",
        orders: 3,
        totalSpent: 1549.97,
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        orders: 1,
        totalSpent: 349.97,
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "mbrown@example.com",
        orders: 2,
        totalSpent: 1299.98,
      },
    ]

    customersTableBody.innerHTML = ""

    customers.forEach((customer) => {
      const row = document.createElement("tr")

      row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.orders}</td>
                <td>${formatCurrency(customer.totalSpent)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${customer.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `

      customersTableBody.appendChild(row)
    })

    // Add event listeners to view buttons
    const viewButtons = document.querySelectorAll(".view-btn")
    viewButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const customerId = this.getAttribute("data-id")
        alert(`Viewing details for customer ${customerId}. In a real implementation, this would show customer details.`)
      })
    })
  }

  // Add logout functionality
  const logoutLink = document.createElement("a")
  logoutLink.href = "#"
  logoutLink.textContent = "Logout"
  logoutLink.style.position = "absolute"
  logoutLink.style.top = "20px"
  logoutLink.style.right = "20px"
  logoutLink.style.color = "#e74c3c"

  logoutLink.addEventListener("click", (e) => {
    e.preventDefault()
    sessionStorage.removeItem("adminLoggedIn")
    window.location.reload()
  })

  if (adminDashboard) {
    adminDashboard.appendChild(logoutLink)
  }
})
