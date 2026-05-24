import { useEffect } from "react";
import { CATEGORIES } from "../data/products";

/* =========================================================================
   NOCTURNE ENHANCE
   Non-invasive runtime that adds working interactions + animations on top
   of the existing Valkey template, without editing the 70+ components.
   ─────────────────────────────────────────────────────────────────────────
   Responsibilities:
     1. Force-dismiss the preloader once the document is ready
     2. IntersectionObserver scroll reveal — adds .is-visible to .noct-reveal,
        and auto-tags every reasonable section so the user gets reveals
        without changing markup
     3. Click delegation:
          • Add-to-Cart on product cards → push to cart (localStorage), toast,
            bump header cart badge, prevent navigation
          • Wishlist heart icons → toggle wishlist, toast, bump heart badge
     4. Sync the cart + wishlist badges in HeaderOne (and mobile header) with
        the live count from localStorage on every change
     5. Toast stack (mount + show + auto-dismiss)
   ========================================================================= */

const CART_KEY = "noct.cart";
const WISH_KEY = "noct.wish";

/* ── localStorage helpers ─────────────────────────────────────────────── */
const readSet = (key) => {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set(); }
};
const writeSet = (key, set) => {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch {}
};

/* Stable id for a product card so the same item doesn't double-count.
   Prefers `data-product` on the Acquire button if present (real catalogue),
   then falls back to title text. */
const productIdFor = (cardEl, btnEl, index) => {
  if (btnEl?.getAttribute("data-product")) return btnEl.getAttribute("data-product");
  if (!cardEl) return `noct-${index}`;
  const title = cardEl.querySelector("h6, h5, h4, h3, .product-title, .product-card__title")?.textContent?.trim();
  const href  = cardEl.querySelector("a[href*='product']")?.getAttribute("href");
  return (title || href || `noct-card-${index}`).replace(/\s+/g, "-").toLowerCase();
};

/* Product name for toast — prefers explicit data-product-name */
const productNameFor = (cardEl, btnEl) => {
  return btnEl?.getAttribute("data-product-name")
      || cardEl?.querySelector("h6, h5, h4, h3, .product-title, a[href*='product']")?.textContent?.trim()
      || "Item";
};

/* ── Toast system ─────────────────────────────────────────────────────── */
let toastStack;
const ensureStack = () => {
  if (toastStack && document.body.contains(toastStack)) return toastStack;
  toastStack = document.createElement("div");
  toastStack.className = "noct-toast-stack";
  document.body.appendChild(toastStack);
  return toastStack;
};
const toast = ({ title, sub, variant = "cart", icon = "+" }) => {
  const stack = ensureStack();
  const el = document.createElement("div");
  el.className = `noct-toast noct-toast--${variant}`;
  el.innerHTML = `
    <div class="noct-toast__icon" aria-hidden="true">${icon}</div>
    <div>
      <div class="noct-toast__title"></div>
      <div class="noct-toast__sub"></div>
    </div>`;
  el.querySelector(".noct-toast__title").textContent = title;
  el.querySelector(".noct-toast__sub").textContent = sub || "";
  stack.appendChild(el);
  requestAnimationFrame(() => el.classList.add("is-visible"));
  setTimeout(() => {
    el.classList.remove("is-visible");
    el.classList.add("is-leaving");
    setTimeout(() => el.remove(), 450);
  }, 2600);
};

/* ── Badge sync ───────────────────────────────────────────────────────── */
const findBadges = (kind) => {
  // The template renders an `<a href="/cart">` (or /wishlist) wrapping the icon
  // and a tiny absolute-positioned span with the count. We mark those spans
  // with data-noct-badge on first pass for easy re-targeting later.
  const linkSel = kind === "cart" ? 'a[href="/cart"]' : 'a[href="/wishlist"]';
  const iconCls = kind === "cart" ? "ph-shopping-cart-simple" : "ph-heart";
  const links = document.querySelectorAll(linkSel);
  const badges = [];
  links.forEach((link) => {
    if (!link.querySelector(`.${iconCls}`)) return;
    let badge = link.querySelector("[data-noct-badge]");
    if (!badge) {
      // The hardcoded badge is the absolute-positioned span with class
      // "position-absolute top-n6 end-n4" inside the icon wrapper
      const inner = link.querySelector(".position-absolute");
      if (inner) {
        inner.setAttribute("data-noct-badge", kind);
        badge = inner;
      }
    }
    if (badge) badges.push(badge);
  });
  return badges;
};

const syncBadges = (animate = false) => {
  const cartCount = readSet(CART_KEY).size;
  const wishCount = readSet(WISH_KEY).size;
  /* IMPORTANT: do NOT modify badge.textContent — React owns the text node
     inside that span, and replacing it can cause "removeChild: not a child"
     crashes when React later unmounts the component. Instead drive the
     visible count via a CSS custom property + ::before pseudo (defined in
     nocturne.css). Style attribute changes are safe because React doesn't
     reconcile inline styles back to JSX. */
  const apply = (badge, count) => {
    if (!badge) return;
    badge.classList.add("noct-badge-overlay");
    badge.style.setProperty("--noct-count", `"${count}"`);
    const desiredDisplay = count > 0 ? "" : "none";
    if (badge.style.display !== desiredDisplay) badge.style.display = desiredDisplay;
    if (animate) {
      badge.classList.remove("noct-badge-bump");
      void badge.offsetWidth;
      badge.classList.add("noct-badge-bump");
    }
  };
  findBadges("cart").forEach(b => apply(b, cartCount));
  findBadges("wish").forEach(b => apply(b, wishCount));
};

/* ── Preloader dismiss ────────────────────────────────────────────────── */
/* IMPORTANT: never call .remove() on React-owned nodes — React will try to
   unmount them later and crash with "removeChild: not a child of this node".
   We only toggle classes/attributes; CSS handles the visual dismissal, and
   React handles the eventual DOM removal when <Preloader> flips its state. */
const dismissPreloader = () => {
  const finish = () => {
    document.documentElement.classList.add("noct-ready");
    document.documentElement.setAttribute("data-noct-loaded", "1");
    document.querySelectorAll(".preloader").forEach((el) => {
      el.classList.add("noct-fade-out");
    });
  };
  if (document.readyState === "complete") {
    setTimeout(finish, 200);
  } else {
    window.addEventListener("load", () => setTimeout(finish, 150), { once: true });
  }
  // hard safety net regardless of state — flag the html at 2s no matter what
  setTimeout(finish, 2000);
};

/* ── Scroll reveal ────────────────────────────────────────────────────── */
const autoTagReveals = () => {
  // Tag every "section" + every product grid container the template ships,
  // so reveals appear without editing markup.
  const candidates = document.querySelectorAll(
    "section, .product-list, .product-grid, .product-card, .row .product-card, " +
    ".banner, .promotional, .deal-section, .deals, .feature, .top-vendors, .footer-wrapper, footer"
  );
  candidates.forEach((el) => {
    if (!el.classList.contains("noct-reveal")) {
      el.classList.add("noct-reveal");
    }
  });
};

const setupObserver = () => {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".noct-reveal").forEach(el => el.classList.add("is-visible"));
    return null;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

  document.querySelectorAll(".noct-reveal").forEach(el => io.observe(el));
  return io;
};

/* ── Click delegation ─────────────────────────────────────────────────── */
const handleAddToCart = (e, target) => {
  e.preventDefault();
  e.stopPropagation();
  const card = target.closest(".product-card, .product-item, .deal-item, .noct-cat-card, [class*='product']")
            || target.parentElement;
  const id = productIdFor(card, target, Date.now());
  const set = readSet(CART_KEY);
  const wasIn = set.has(id);
  set.add(id);
  writeSet(CART_KEY, set);
  syncBadges(true);

  const productTitle = productNameFor(card, target);
  toast({
    title: wasIn ? "Already in your bag" : "Added to your bag",
    sub: productTitle.slice(0, 60),
    variant: "cart",
    icon: "✦",
  });
};

const handleWishlist = (e, target) => {
  // Only intercept if the heart is part of a product card action (not the
  // header link to /wishlist — that one should still navigate).
  if (target.closest('a[href="/wishlist"]')) return;
  e.preventDefault();
  e.stopPropagation();
  const card = target.closest(".product-card, .product-item, .noct-cat-card, .noct-product, [class*='product']") || target.parentElement;
  const id = productIdFor(card, target, Date.now());
  const set = readSet(WISH_KEY);
  let title = "Saved to wishlist", sub = "";
  const productTitle = productNameFor(card, target);
  if (set.has(id)) {
    set.delete(id);
    target.closest(".product-card, .product-item, .noct-cat-card")?.classList.remove("noct-wishlisted");
    title = "Removed from wishlist";
  } else {
    set.add(id);
    target.closest(".product-card, .product-item, .noct-cat-card")?.classList.add("noct-wishlisted");
  }
  writeSet(WISH_KEY, set);
  syncBadges(true);
  sub = productTitle.slice(0, 60);
  toast({ title, sub, variant: "wish", icon: "♥" });
};

/* slugify "Fresh Seafood" → "fresh-seafood" */
const slugify = (txt) =>
  (txt || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);

/* Detect that an element sits inside a category mega-menu dropdown. We
   look for several markers the template uses for those panels. */
const isInCategoryMenu = (el) =>
  !!el.closest(
    ".category .responsive-dropdown, " +
    ".category .common-dropdown, " +
    ".category .submenus-submenu-wrapper, " +
    ".category-two .responsive-dropdown, " +
    ".category-two .common-dropdown, " +
    ".has-submenus-submenu .submenus-submenu"
  );

const handleCategoryNav = (e, link) => {
  if (!isInCategoryMenu(link)) return false;
  const href = link.getAttribute("href") || "";
  // If the template already gave it a real route (something other than #),
  // honour that — we only intercept the placeholder links.
  if (href && href !== "#" && !href.endsWith("#")) return false;
  const txt = link.textContent.replace(/\d+/g, "").trim();
  const slug = slugify(txt);
  if (!slug) return false;
  e.preventDefault();
  e.stopPropagation();
  const url = `/category/${slug}`;
  // Use react-router-friendly navigation — pushState then dispatch popstate
  // so BrowserRouter picks it up without a full reload.
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  return true;
};

const onDocClick = (e) => {
  const t = e.target;
  if (!(t instanceof Element)) return;

  // Add-to-cart pill OR cart-icon button inside a product card
  const addBtn = t.closest(".product-card__cart, .add-to-cart, [data-noct-add]");
  if (addBtn) { handleAddToCart(e, addBtn); return; }

  // Wishlist heart on product cards (NOT the header /wishlist link)
  const heartBtn = t.closest(".ph-heart");
  if (heartBtn) { handleWishlist(e, heartBtn); return; }

  // Category mega-menu link → /category/<slug>
  const catLink = t.closest("a");
  if (catLink && handleCategoryNav(e, catLink)) return;
};

/* ── Header cart button quick-navigate guard ──────────────────────────── */
// If the user clicks the header cart link AND there's nothing in their cart,
// we still let them navigate — that page handles empty state.
// Otherwise no interception needed; native navigation is fine.

/* ── Category strip injection ─────────────────────────────────────────── */
/* Insert a slim horizontal category bar after the last <header> so every
   page (Home, Shop, Cart, Checkout, Category, Product …) shows the same
   8 categories. Idempotent — re-runs safely if React re-renders. */
const ensureCategoryStrip = () => {
  const lastHeader = Array.from(document.querySelectorAll("header"))
    .filter((h) => h.offsetParent !== null) // visible only
    .pop();
  if (!lastHeader) return;

  let strip = document.querySelector(".noct-cat-strip");
  if (!strip) {
    strip = document.createElement("nav");
    strip.className = "noct-cat-strip";
    strip.setAttribute("aria-label", "Categories");

    const inner = document.createElement("div");
    inner.className = "noct-cat-strip__inner container container-lg";

    CATEGORIES.forEach((c) => {
      const a = document.createElement("a");
      a.href = `/category/${c.slug}`;
      a.className = "noct-cat-strip__link";
      a.dataset.slug = c.slug;
      a.textContent = c.label;
      // SPA-friendly nav so no full reload
      a.addEventListener("click", (ev) => {
        if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button !== 0) return;
        ev.preventDefault();
        window.history.pushState({}, "", a.href);
        window.dispatchEvent(new PopStateEvent("popstate"));
      });
      inner.appendChild(a);
    });

    strip.appendChild(inner);
  }

  // Position after the last visible header if not already
  if (strip.previousElementSibling !== lastHeader) {
    lastHeader.parentNode.insertBefore(strip, lastHeader.nextSibling);
  }

  // Sync active state with current path
  const path = window.location.pathname;
  strip.querySelectorAll(".noct-cat-strip__link").forEach((a) => {
    const active = path === `/category/${a.dataset.slug}`;
    a.classList.toggle("is-active", active);
  });
};

/* ── Component ────────────────────────────────────────────────────────── */
const NocturneEnhance = () => {
  useEffect(() => {
    // 1. dismiss preloader
    dismissPreloader();

    // 2. badges with current values
    // (header may not be mounted yet on first tick; rAF + retry once)
    const initBadges = () => syncBadges(false);
    initBadges();
    requestAnimationFrame(initBadges);
    setTimeout(initBadges, 400);

    // 3. tag reveals + observe + inject category strip
    autoTagReveals();
    ensureCategoryStrip();
    let io = setupObserver();

    // Sync active state on route change (browser back/forward + our pushState)
    const onNav = () => ensureCategoryStrip();
    window.addEventListener("popstate", onNav);

    // 4. delegated clicks
    document.addEventListener("click", onDocClick, true);

    // 5. re-scan on route changes / DOM mutations. Debounced with rAF so a
    //    burst of mutations only schedules one re-scan, and we never call
    //    syncBadges from here (it writes to the DOM, which would feed back
    //    into the observer and lock the page).
    let pending = false;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        autoTagReveals();
        ensureCategoryStrip();
        document.querySelectorAll(".noct-reveal:not(.is-visible)").forEach((el) => {
          try { io?.observe(el); } catch {}
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("popstate", onNav);
      mo.disconnect();
      io?.disconnect();
    };
  }, []);

  return null;
};

export default NocturneEnhance;
