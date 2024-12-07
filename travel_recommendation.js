// main.js

// Sayfa yüklendiğinde çalışacak fonksiyon
window.addEventListener("DOMContentLoaded", (event) => {
  loadContentFromHash(); // Hash parametresine göre içerik yükle
});

// URL hash değiştiğinde içerik yükle
window.addEventListener("hashchange", () => {
  loadContentFromHash();
});

// Hash'e göre uygun HTML dosyasını yükleyen fonksiyon
function loadContentFromHash() {
  const hash = window.location.hash.substring(1); // hash'i al

  const mainContent = document.getElementById("main-content");

  if (!hash) {
    // Eğer hash yoksa ana sayfayı (home.html) yükle
    loadContent("home.html");
    return;
  }

  // Yüklemek için uygun dosya adını ayarlıyoruz
  const contentFile = `${hash}.html`;

  // Dinamik olarak içerik yükle
  loadContent(contentFile);
}

// Dinamik içerik yüklemek için yardımcı fonksiyon
function loadContent(contentFile) {
  const mainContent = document.getElementById("main-content");

  fetch(contentFile)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Content not found");
      }
      return response.text();
    })
    .then((html) => {
      mainContent.innerHTML = html;
    })
    .catch((error) => {
      mainContent.innerHTML = "<p>Content not found. Please check the URL.</p>";
    });
}

// Sayfa yüklendiğinde navbar'ın "Home" sekmesinde olup olmadığını kontrol et
document.addEventListener("DOMContentLoaded", function () {
  // Navbar search butonlarını sadece home sayfasında etkinleştirelim
  const searchBtn = document.querySelector(".search-btn");
  const cleanBtn = document.querySelector(".clean-btn");
  const searchInput = document.getElementById("searchInput");

  // Eğer sayfa "Home" kısmında ise butonları aktif tut
  if (window.location.hash === "#home" || window.location.hash === "/") {
    searchBtn.style.display = "inline-block"; // Butonları göster
    cleanBtn.style.display = "inline-block"; // Butonları göster
    searchInput.style.display = "inline-block";
    searchBtn.disabled = false;
    cleanBtn.disabled = false;
    searchInput.disabled = false;
  } else {
    searchBtn.style.display = "none"; // Butonları gizle
    cleanBtn.style.display = "none"; // Butonları gizle
    searchInput.style.display = "none"; // Butonları gizle
    searchBtn.disabled = true;
    cleanBtn.disabled = true;
    searchInput.disabled = true;
  }

  // Navbar linklerine tıklanınca sayfa değişirse butonları güncelle
  const navbarLinks = document.querySelectorAll(".navbar-links a");
  navbarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (link.getAttribute("href") === "#home") {
        searchBtn.style.display = "inline-block"; // Butonları göster
        cleanBtn.style.display = "inline-block"; // Butonları göster
        searchInput.style.display = "inline-block"; // Butonları göster
        searchBtn.disabled = false;
        cleanBtn.disabled = false;
        searchInput.disabled = false;
      } else {
        searchBtn.style.display = "none"; // Butonları gizle
        cleanBtn.style.display = "none"; // Butonları gizle
        searchInput.style.display = "none"; // Butonları gizle
        searchBtn.disabled = true;
        cleanBtn.disabled = true;
        searchInput.disabled = true;
      }
    });
  });
});

// Helper function to convert strings to lowercase for case-insensitive comparison
function toLowerCaseArray(arr) {
  return arr.map((item) => item.toLowerCase());
}

// Function to search recommendations
async function searchRecommendations() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const recommendationList = document.getElementById("recommendation-list");
  recommendationList.innerHTML = ""; // Clear previous results

  const keywords = ["beach", "temple", "country", "city"];

  if (searchQuery) {
    // Fetch JSON data from the api.json file (same directory as the JS file)
    const response = await fetch("travel_recommendation_api.json"); // Automatically assumes same directory
    const data = await response.json();

    // Filter based on search query
    const matchingBeaches = data.beaches.filter((beach) =>
      beach.name.toLowerCase().includes(searchQuery)
    );
    const matchingTemples = data.temples.filter((temple) =>
      temple.name.toLowerCase().includes(searchQuery)
    );
    const matchingCountries = data.countries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery)
    );

    // Combine all matching results
    const allMatches = [
      ...matchingBeaches,
      ...matchingTemples,
      ...matchingCountries.flatMap((country) => country.cities),
    ];

    // Display results
    allMatches.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("recommendation-card");

      const img = document.createElement("img");
      img.src = item.imageUrl || "https://placehold.co/300x200";
      img.alt = item.name;
      img.classList.add("destination-image");

      const title = document.createElement("h4");
      title.classList.add("destination-title");
      title.textContent = item.name;

      const description = document.createElement("p");
      description.classList.add("destination-description");
      description.textContent = item.description;

      const button = document.createElement("button");
      button.classList.add("visit-button");
      button.textContent = "Visit";

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(description);
      card.appendChild(button);

      recommendationList.appendChild(card);
    });
  }
}

// Function to clear search results
function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("recommendation-list").innerHTML = "";
}
