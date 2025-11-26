// - - - - - - - - - -
// mobile nav toggle
// - - - - - - - - - -
// creates the hamburger menu toggle functionality for mobile navigation
function setupNavToggle() {
  // create constants for toggle button, menu, and body
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("main-menu");
  const body = document.body;

  // check if elements exist ; if not , exit function
  if (!toggle || !menu) return;

  // creating a function to close the menu
  function closeMenu() {
    // tell screen readers menu is closed
    toggle.setAttribute("aria-expanded", "false");
    // removes the class that makes the hamburger into an x
    toggle.classList.remove("is-open");
    // hides the sliding menu
    menu.classList.remove("nav-open");
    // removes the class that prevents scrolling
    body.classList.remove("nav-open");
  }

  // toggle menu opens/closes on button click
  toggle.addEventListener("click", () => {
    // check current state
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    // determine new state
    const newState = !isOpen;

    // apply new state
    toggle.setAttribute("aria-expanded", String(newState));
    // swap hamburger to X and vice versa
    toggle.classList.toggle("is-open", newState);
    // show/hide sliding menu
    menu.classList.toggle("nav-open", newState);
    // prevent/allow body scrolling
    body.classList.toggle("nav-open", newState);
  });

  // close menu when a link is clicked
  menu.addEventListener("click", (event) => {
    // only close if an actual link was clicked
    if (event.target.tagName.toLowerCase() === "a") {
      closeMenu();
    }
  });

  // reset when resizing to tablet/desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 800) {
      closeMenu();
    }
  });
}

// - - - - - - - - - -
// rotating 5-star reviews
// - - - - - - - - - -
// set up a function that rotates through customer reviews every few seconds
function setupReviewRotator() {
  // create constants for review text, name, role, and quote container
  const textEl = document.getElementById("review-text");
  const nameEl = document.getElementById("review-name");
  const roleEl = document.getElementById("review-role");
  const quoteEl = document.querySelector(".review-quote");

  // check if elements exist ; if not , exit function
  if (!textEl || !nameEl || !roleEl || !quoteEl) return;

  // array of review objects
  const reviews = [
    {
      text: "“These mixes are my absolute favorite. Can't wait for new flavors!”",
      name: "Stephanie P.",
      role: "College Student",
    },
    {
      text: "“The Maple Crunch mix is top tier. Fluffy, flavorful, and honestly better than most scratch recipes I've tried.”",
      name: "Alex R.",
      role: "Home Chef",
    },
    {
      text: "“We started using Bake Brunch Co. in our small town local café and customers keep asking where they can buy the mixes every day!”",
      name: "Sam K.",
      role: "Café Owner",
    },
    {
      text: "“Both of my kids are picky, but they love these mixes. It's also so easy to make.”",
      name: "Nicole L.",
      role: "Parent of Two",
    },
  ];

  // if only one review, no need to rotate
  if (reviews.length <= 1) return;

  // index to track current review
  let index = 0;

  // function to display a review based on index
  function showReview(i) {
    // get the review object [i]
    const review = reviews[i];
    // update the DOM elements with review data
    textEl.textContent = review.text;
    nameEl.textContent = review.name;
    roleEl.textContent = review.role;
  }

  // when page loads , show the first review
  showReview(index);

  // set interval to rotate reviews every 5 seconds
  setInterval(() => {
    // if quote element is removed from DOM , stop rotation
    if (!document.body.contains(quoteEl)) return;

    // add fading class for transition effect
    quoteEl.classList.add("is-fading");

    // wait for fade-out to complete before changing text
    setTimeout(() => {
      // move to next review index
      index = (index + 1) % reviews.length;
      // update the review display
      showReview(index);
      // remove fading class to fade back in
      quoteEl.classList.remove("is-fading");
    }, 500); // match CSS transition duration
  }, 5000); // change every 5 seconds
}

// - - - - - - - - - -
// DOMContentLoaded event
// - - - - - - - - - -
// initialize functions when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  setupNavToggle();
  setupReviewRotator();
});
