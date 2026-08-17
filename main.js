document.addEventListener('DOMContentLoaded', function () {
  var productList = document.getElementById('product-list');
  var backToTop = document.getElementById('back-to-top');

  function formatPrice(price) {
    if (price === '0' || price === 0) return 'رایگان';
    return Number(price).toLocaleString('fa-IR') + ' تومان';
  }

  function escapeHTML(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function truncate(text, n) {
    text = text || '';
    return text.length > n ? text.slice(0, n) + '…' : text;
  }

  function loadProducts() {
    if (!productList) return;
    fetch('products.json')
      .then(function (r) {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then(function (products) {
        productList.innerHTML = '';
        products.forEach(function (product, index) {
          var card = document.createElement('article');
          card.className = 'product-card';
          card.style.animationDelay = index * 0.08 + 's';
          card.innerHTML =
            (product.id === 1 ? '<div class="product-badge">ویژه</div>' : '') +
            '<div class="product-card-image">' +
            '<img src="' + escapeHTML(product.image) + '" alt="' + escapeHTML(product.name) + '" loading="lazy" onerror="this.style.opacity=0.3">' +
            '</div>' +
            '<div class="product-body">' +
            '<h3>' + escapeHTML(product.name) + '</h3>' +
            '<div class="product-price">از ' + formatPrice(product.price) + '</div>' +
            '<p class="product-desc">' + escapeHTML(truncate(product.details, 110)) + '</p>' +
            '<a class="btn" href="product.html?id=' + product.id + '">مشاهده و سفارش</a>' +
            '</div>';
          card.addEventListener('click', function (e) {
            if (!e.target.closest('a')) {
              window.location.href = 'product.html?id=' + product.id;
            }
          });
          productList.appendChild(card);
        });
      })
      .catch(function () {
        productList.innerHTML =
          '<div class="loading"><p>خطا در بارگذاری خدمات</p>' +
          '<button class="btn btn-primary" style="margin-top:12px" onclick="location.reload()">تلاش مجدد</button></div>';
      });
  }

  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('show', window.scrollY > 280);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  loadProducts();
});
