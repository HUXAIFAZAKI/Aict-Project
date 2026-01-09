const NextGenApp = {
  cartCount: 0,
  cartItems: [],

  init() {
    this.initLoader();
    this.initNavigation();
    this.initSearch();
    this.initProductFilters();
    this.initStatsCounter();
    this.initCartSystem();
    this.initCartSidebar();
    this.initScrollFeatures();
    this.initAnimations();
    this.initQuickView();
    this.initAuthSystem();
    this.initContactForm();
    this.updateCartBadge();
  },

  showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

    notification.style.cssText = `
            position: fixed; top: 100px; right: 20px;
            background: rgba(255, 255, 255, 0.95); color: #000;
            padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000;
            transform: translateX(100%); opacity: 0; transition: all 0.3s ease;
        `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      notification.style.opacity = "0";
      setTimeout(() => {
        if (notification.parentNode) notification.remove();
      }, 300);
    }, 3000);
  },

  initLoader() {
    setTimeout(() => {
      const loader = document.querySelector(".loading-screen");
      if (loader) loader.classList.add("loaded");
      document.body.style.overflow = "auto";
    }, 1500);
  },

  initNavigation() {
    const nav = document.querySelector(".glass-nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    window.addEventListener("scroll", () => {
      nav?.classList.toggle("scrolled", window.scrollY > 50);
    });

    menuToggle?.addEventListener("click", () => {
      navLinks?.classList.toggle("active");
      menuToggle?.classList.toggle("active");
    });
  },

  initSearch() {
    const btn = document.querySelector(".search-btn");
    const wrapper = document.querySelector(".search-wrapper");
    btn?.addEventListener("click", () => {
      wrapper?.classList.toggle("active");
      if (wrapper?.classList.contains("active"))
        wrapper.querySelector("input")?.focus();
    });
  },

  initProductFilters() {
    const btns = document.querySelectorAll(".filter-btn");
    const products = document.querySelectorAll(".product-card");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter =
          btn.dataset.filter || btn.textContent.trim().toLowerCase();

        products.forEach((product) => {
          const category = product.dataset.category?.toLowerCase() || "";
          if (
            filter === "all" ||
            category.includes(filter) ||
            filter === "all products"
          ) {
            product.style.display = "";
            product.classList.add("fade-in");
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  },

  initStatsCounter() {
    const stats = document.querySelectorAll("[data-count]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"));
          const suffix = el.textContent.replace(/[0-9]/g, "");
          let count = 0;
          const timer = setInterval(() => {
            count += target / 50;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(count) + suffix;
          }, 30);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach((s) => observer.observe(s));
  },

  initCartSystem() {
    document.querySelectorAll(".add-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest(".product-card");
        if (!card) return;

        const product = {
          id: card.dataset.id || Date.now().toString(),
          name: card.querySelector("h3")?.textContent || "Product",
          price: card.querySelector(".price")?.textContent || "Rs0.00",
          image: card.querySelector("img")?.src || "",
          category: card.querySelector(".product-category")?.textContent || "",
          quantity: 1,
        };

        const existingItem = this.cartItems.find(
          (item) => item.id === product.id
        );
        if (existingItem) {
          existingItem.quantity++;
        } else {
          this.cartItems.push(product);
        }

        this.cartCount = this.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        this.updateCartBadge();
        this.updateCartSidebar();
        btn.style.transform = "scale(0.9)";
        setTimeout(() => (btn.style.transform = "scale(1)"), 200);
        this.showNotification("Product added to cart!");
      });
    });
  },

  updateCartBadge() {
    const badge = document.querySelector(".cart-badge");
    if (badge) {
      badge.textContent = this.cartCount;
      badge.style.display = this.cartCount > 0 ? "flex" : "none";
    }
  },

  initCartSidebar() {
    const sidebar = document.getElementById("cartSidebar");
    const cartBtn = document.querySelector(".cart-btn");
    const closeBtn = document.getElementById("cartCloseBtn");
    const backdrop = sidebar?.querySelector(".cart-sidebar-backdrop");

    cartBtn?.addEventListener("click", () => {
      sidebar?.classList.add("active");
      document.body.style.overflow = "hidden";
      this.updateCartSidebar();
    });

    const closeCart = () => {
      sidebar?.classList.remove("active");
      document.body.style.overflow = "";
    };

    closeBtn?.addEventListener("click", closeCart);
    backdrop?.addEventListener("click", closeCart);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sidebar?.classList.contains("active")) {
        closeCart();
      }
    });

    document.getElementById("checkoutBtn")?.addEventListener("click", () => {
      this.showNotification("Redirecting to checkout...");
    });

    this.updateCartSidebar();
  },

  updateCartSidebar() {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartFooter = document.getElementById("cartFooter");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItemsContainer) return;

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <a href="products.html" class="btn-glass">Continue Shopping</a>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = "none";
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = this.cartItems
      .map((item) => {
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0;
        const itemTotal = priceNum * item.quantity;
        subtotal += itemTotal;
        return `
          <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
              ${
                item.image
                  ? `<img src="${item.image}" alt="${item.name}">`
                  : '<div class="cart-item-placeholder"><i class="fas fa-box"></i></div>'
              }
            </div>
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p class="cart-item-category">${item.category}</p>
              <div class="cart-item-price">${item.price}</div>
            </div>
            <div class="cart-item-controls">
              <div class="cart-item-quantity">
                <button class="qty-btn" data-action="decrease" data-id="${
                  item.id
                }">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" data-action="increase" data-id="${
                  item.id
                }">+</button>
              </div>
              <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");

    if (cartSubtotal) cartSubtotal.textContent = `Rs${subtotal.toFixed(2)}`;
    if (cartTotal) cartTotal.textContent = `Rs${subtotal.toFixed(2)}`;
    if (cartFooter) cartFooter.style.display = "block";

    cartItemsContainer.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const item = this.cartItems.find((i) => i.id === id);
        if (!item) return;

        if (action === "increase") {
          item.quantity++;
        } else if (action === "decrease" && item.quantity > 1) {
          item.quantity--;
        }

        this.cartCount = this.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        this.updateCartBadge();
        this.updateCartSidebar();
      });
    });

    cartItemsContainer.querySelectorAll(".cart-item-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.cartItems = this.cartItems.filter((item) => item.id !== id);
        this.cartCount = this.cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        this.updateCartBadge();
        this.updateCartSidebar();
        this.showNotification("Item removed from cart");
      });
    });
  },

  initScrollFeatures() {
    const btt = document.querySelector(".back-to-top");
    window.addEventListener("scroll", () =>
      btt?.classList.toggle("visible", window.scrollY > 500)
    );
    btt?.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

    document
      .querySelector(".newsletter-form")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(
          "Subscribed:",
          e.target.querySelector('input[type="email"]').value
        );
        this.showNotification("Thank you for subscribing!");
        e.target.reset();
      });
  },

  initAnimations() {
    const fadeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => fadeObs.observe(el));

    const timeObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("active"), i * 300);
            timeObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document
      .querySelectorAll(".timeline-item")
      .forEach((item) => timeObs.observe(item));
  },

  initQuickView() {
    const modal = document.getElementById("quickViewModal");
    if (!modal) return;

    const updateModal = (card) => {
      document.getElementById("qvCategory").textContent =
        card.querySelector(".product-category").textContent;
      document.getElementById("qvTitle").textContent =
        card.querySelector("h3").textContent;
      document.getElementById("qvRating").textContent =
        card.querySelector(".rating span").textContent;
      document.getElementById("qvPrice").textContent =
        card.querySelector(".price").textContent;
      document.getElementById("qvOriginal").textContent =
        card.querySelector(".original-price")?.textContent || "";
      document.getElementById("qvDesc").textContent =
        card.querySelector(".product-desc").textContent;
      document.getElementById("qvSpecs").innerHTML =
        card.querySelector(".specs").innerHTML;

      const qvImg = document.getElementById("qvImage");
      const sourceImg = card.querySelector("img");
      qvImg.innerHTML = "";
      if (sourceImg) {
        qvImg.appendChild(sourceImg.cloneNode());
      } else {
        const placeholder = card.querySelector(".placeholder-img");
        qvImg.className =
          "placeholder-img " +
          Array.from(placeholder.classList).find((c) =>
            c.startsWith("product-")
          );
      }
    };

    let currentQuantity = 1;
    let currentProductCard = null;
    const qtyInput = modal.querySelector(".quantity-selector input");
    const qtyDecrease = modal.querySelector(
      ".quantity-selector button:first-child"
    );
    const qtyIncrease = modal.querySelector(
      ".quantity-selector button:last-child"
    );

    document.querySelectorAll(".quick-view").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentProductCard = btn.closest(".product-card");
        updateModal(currentProductCard);
        currentQuantity = 1;
        if (qtyInput) qtyInput.value = 1;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    [
      document.querySelector(".qv-close"),
      document.querySelector(".qv-backdrop"),
    ].forEach((el) => {
      el?.addEventListener("click", () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    qtyDecrease?.addEventListener("click", () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        if (qtyInput) qtyInput.value = currentQuantity;
      }
    });

    qtyIncrease?.addEventListener("click", () => {
      currentQuantity++;
      if (qtyInput) qtyInput.value = currentQuantity;
    });

    const qvAddBtn = modal.querySelector(".qv-add-btn");
    qvAddBtn?.addEventListener("click", () => {
      if (!currentProductCard) return;

      const product = {
        id: currentProductCard.dataset.id || Date.now().toString(),
        name: document.getElementById("qvTitle")?.textContent || "Product",
        price: document.getElementById("qvPrice")?.textContent || "Rs0.00",
        image:
          modal.querySelector("#qvImage img")?.src ||
          currentProductCard.querySelector("img")?.src ||
          "",
        category: document.getElementById("qvCategory")?.textContent || "",
        quantity: currentQuantity,
      };

      const existingItem = this.cartItems.find(
        (item) => item.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += currentQuantity;
      } else {
        this.cartItems.push(product);
      }

      this.cartCount = this.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      this.updateCartBadge();
      this.updateCartSidebar();
      this.showNotification("Product added to cart!");
      modal.classList.remove("active");
      document.body.style.overflow = "";
      currentQuantity = 1;
      if (qtyInput) qtyInput.value = 1;
    });
  },

  initAuthSystem() {
    const nodes = {
      authModal: document.getElementById("authModal"),
      forgotModal: document.getElementById("forgotModal"),
      loginBtn: document.querySelector('.icon-btn[aria-label="Login"]'),
      tabs: document.querySelectorAll(".auth-tab"),
      forms: document.querySelectorAll(".auth-form"),
      signupFirstName: document.getElementById("signupFirstName"),
      signupLastName: document.getElementById("signupLastName"),
      signupPass: document.getElementById("signupPassword"),
      confirmPass: document.getElementById("confirmPassword"),
    };

    const switchTab = (tabName) => {
      nodes.tabs.forEach((t) =>
        t.classList.toggle("active", t.dataset.tab === tabName)
      );
      nodes.forms.forEach((f) =>
        f.classList.toggle("active", f.dataset.form === tabName)
      );
    };

    const closeModals = () => {
      nodes.authModal?.classList.remove("active");
      nodes.forgotModal?.classList.remove("active");
      document.body.style.overflow = "auto";
      [
        document.getElementById("loginForm"),
        document.getElementById("signupForm"),
        document.getElementById("forgotForm"),
      ].forEach((f) => f?.reset());
    };

    nodes.loginBtn?.addEventListener("click", () => {
      nodes.authModal?.classList.add("active");
      document.body.style.overflow = "hidden";
      switchTab("login");
    });

    document
      .querySelectorAll(
        "#authCloseBtn, #authModalBackdrop, [data-forgot-backdrop], [data-forgot-close]"
      )
      .forEach((el) => {
        el?.addEventListener("click", closeModals);
      });

    document
      .querySelector(".forgot-password")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        nodes.authModal?.classList.remove("active");
        nodes.forgotModal?.classList.add("active");
        document.body.style.overflow = "hidden";
      });

    document
      .querySelector("[data-back-to-login]")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        nodes.forgotModal.classList.remove("active");
        nodes.authModal.classList.add("active");
        switchTab("login");
      });

    nodes.tabs.forEach((t) =>
      t.addEventListener("click", () => switchTab(t.dataset.tab))
    );

    document.querySelectorAll(".toggle-password").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.target);
        const isPass = input.type === "password";
        input.type = isPass ? "text" : "password";
        btn.innerHTML = `<i class="fas fa-eye${isPass ? "-slash" : ""}"></i>`;
      });
    });

    nodes.signupPass?.addEventListener("input", (e) => {
      const val = e.target.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const fill = document.querySelector(".strength-fill");
      const text = document.querySelector(".strength-text");
      const colors = ["#ff4444", "#ff4444", "#ffbb33", "#00C851", "#00C851"];
      const labels = ["weak", "weak", "medium", "strong", "strong"];

      if (fill) {
        fill.style.width = `${(strength / 4) * 100}%`;
        fill.style.background = colors[strength];
      }
      if (text) {
        text.textContent = `Password strength: ${labels[strength]}`;
        text.style.color = colors[strength];
      }
    });

    document.getElementById("loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.showNotification("Welcome back to NextGen!");
      setTimeout(closeModals, 1500);
    });

    document.getElementById("signupForm")?.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = nodes.signupFirstName?.value.trim() || "";
      const lastName = nodes.signupLastName?.value.trim() || "";

      if (firstName.length < 3) {
        this.showNotification("First name must be at least 3 characters long!");
        nodes.signupFirstName?.focus();
        return;
      }

      if (lastName.length < 3) {
        this.showNotification("Last name must be at least 3 characters long!");
        nodes.signupLastName?.focus();
        return;
      }

      if (nodes.signupPass.value !== nodes.confirmPass.value) {
        this.showNotification("Passwords do not match!");
        return;
      }

      this.showNotification("Account created successfully!");
      setTimeout(() => switchTab("login"), 1500);
    });

    document.getElementById("forgotForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.showNotification("Check your email for reset instructions");
      setTimeout(closeModals, 2000);
    });

    document.querySelectorAll(".social-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = btn.classList.contains("google") ? "Google" : "GitHub";
        this.showNotification(`${p} login redirecting...`);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModals();
    });
  },

  initContactForm() {
    const contactForm = document.getElementById("contactForm");
    contactForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.showNotification("Thank you! Your message has been sent.");
      contactForm.reset();
    });
  },
};

document.addEventListener("DOMContentLoaded", () => NextGenApp.init());
