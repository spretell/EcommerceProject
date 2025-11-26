// - - - - - - - - - -
// products page script
// - - - - - - - - - -
// runs code once the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // create const of product grid
  const grid = document.getElementById("products-grid");
  // if grid does not exist , stop script
  if (!grid) return;

  // create consts of filter and sorting
  const categorySelect = document.getElementById("filter-category");
  const sortSelect = document.getElementById("sort-price");

  // create empty arrays of products to store data later
  let products = [];
  let filteredProducts = [];

  // show loading message while JSON being fetched
  grid.innerHTML = '<p class="products-empty">Loading mixes…</p>';

  // fetch data from JSON file
  fetch("./data/products.json")
    // handle server response
    .then((response) => {
      // if response not successful :
      if (!response.ok) {
        // show error message
        grid.innerHTML = `
          <p class="products-error">
            We couldn’t load the mixes. Please check <code>data/products.json</code>.
          </p>
        `;
        // stop code here and go to error section
        throw new Error(`HTTP error ${response.status}`);
      }

      // convert resonse into usable JSON data
      return response.json();
    })
    // run when JSON loads successfully
    .then((data) => {
      // save the full product list
      products = data;
      // make copy for filtering and sorting
      filteredProducts = [...products];
      renderProducts(filteredProducts);
    })
    // run if error happens
    .catch((error) => {
      // print out error message to browsing console
      console.error("Error loading products:", error);

      // show simple error message on page
      grid.innerHTML = `
        <p class="products-error">
          We couldn’t load the mixes. Check the file path and browser console.
        </p>
      `;
    });

  // run filters whenever category is changed
  categorySelect.addEventListener("change", applyControls);
  // run sorting whenever the price option is changed
  sortSelect.addEventListener("change", applyControls);

  // create function that handles both filtering and sorting
  function applyControls() {
    // create const variables for the selected category value and sort value
    const category = categorySelect.value;
    const sortBy = sortSelect.value;

    // filter products based on selected category
    filteredProducts = products.filter((product) => {
      // if 'all' is selected, return every product
      if (category === "all") return true;
      // otherwise only keep matching categories
      return product.category === category;
    });

    // sort products from lowest to highest price
    if (sortBy === "price-asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
      // sort products from highest to lowest price
    } else if (sortBy === "price-desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // re-display the updated product list
    renderProducts(filteredProducts);
  }

  // create function that sends the product cards to the page
  function renderProducts(list) {
    // if no product matches filter , show message
    if (!list.length) {
      grid.innerHTML =
        '<p class="products-empty">No mixes match those filters. Try a different category.</p>';
      return;
    }

    // turn each product into html + display it
    grid.innerHTML = list.map(productToCardHTML).join("");
  }

  // create function that builds the html for one product card
  function productToCardHTML(product) {
    // format the price to 2 decimal places
    const price = product.price.toFixed(2);
    // protect the product name from breaking html
    const safeName = escapeHTML(product.name);
    // protect the description from breaking html
    const safeDescription = escapeHTML(product.description);

    // create the css class for category styling
    const categoryClass = `product-card--${product.category}`;
    // convert the category value into readable text
    const categoryLabel = categoryToLabel(product.category);

    // return the full html for one product
    return `
      <article class="product-card ${categoryClass}">
        <div class="product-media">
          <span class="product-tag">${categoryLabel}</span>
          <img
            src="${product.image}"
            alt="${safeName}"
            loading="lazy"
          />
        </div>
  
        <div class="product-body">
          <h2>${safeName}</h2>
          <p class="product-description">${safeDescription}</p>
  
          <div class="product-meta-row">
            <p class="product-price">$${price}</p>
            <button class="btn secondary" type="button">
              Add to cart
            </button>
          </div>
        </div>
      </article>
    `;
  }

  // created function to convert category values into readable labels
  function categoryToLabel(category) {
    switch (category) {
      case "pancake":
        return "Pancake mix";
      case "waffle":
        return "Waffle mix";
      case "gluten-free":
        return "Gluten-free";
      case "vegan":
        return "Vegan";
      case "seasonal":
        return "Seasonal drop";
      default:
        return "Brunch mix";
    }
  }

  // Keeps special characters from breaking the page or running code
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
