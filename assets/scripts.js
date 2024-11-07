let allPosts = [];
let loadedRecommendations = 0;
const recommendationsPerLoad = 4;

// Fungsi untuk memuat semua postingan
async function loadPosts() {
    try {
        const response = await fetch('posts/');
        if (response.ok) {
            const text = await response.text();
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(text, "text/html");
            const links = Array.from(htmlDoc.querySelectorAll("a"));

            links.forEach(async (link) => {
                const href = link.getAttribute("href");
                if (href.endsWith(".html")) {
                    const postResponse = await fetch(`posts/${href}`);
                    const postText = await postResponse.text();
                    const postDoc = parser.parseFromString(postText, "text/html");

                    const title = postDoc.querySelector("title").innerText;
                    const thumbnail1 = postDoc.querySelector(".thumbnail1")?.src || 'https://via.placeholder.com/600x200';
                    const thumbnail2 = postDoc.querySelector(".thumbnail2")?.src || 'https://via.placeholder.com/600x200';

                    // Tambahkan postingan ke daftar
                    allPosts.push({ title, href, thumbnail1, thumbnail2 });
                }
            });
            displayPosts();
        } else {
            console.error("Folder posts tidak ditemukan.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Fungsi untuk menampilkan postingan di halaman utama
function displayPosts() {
    const postList = document.getElementById("post-list");
    postList.innerHTML = '';

    allPosts.forEach(post => {
        const postItem = document.createElement("div");
        postItem.className = "post-item";
        postItem.innerHTML = `
            <a href="posts/${post.href}">
                <div class="thumbnail-group">
                    <img src="${post.thumbnail1}" alt="Thumbnail 1">
                    <img src="${post.thumbnail2}" alt="Thumbnail 2">
                </div>
                <h2>${post.title}</h2>
            </a>
        `;
        postList.appendChild(postItem);
    });
}

// Fungsi untuk menampilkan saran artikel di dalam postingan
function loadRecommendations() {
    const recommendationList = document.getElementById("recommendation-list");

    // Tampilkan 4 artikel per batch
    const maxLoad = loadedRecommendations + recommendationsPerLoad;
    for (let i = loadedRecommendations; i < Math.min(maxLoad, allPosts.length); i++) {
        const post = allPosts[i];

        const recItem = document.createElement("div");
        recItem.className = "recommendation";
        recItem.innerHTML = `
            <a href="${post.href}">
                <div class="thumbnail-group">
                    <img src="${post.thumbnail1}" alt="Thumbnail 1">
                    <img src="${post.thumbnail2}" alt="Thumbnail 2">
                </div>
                <p>${post.title}</p>
            </a>
        `;
        recommendationList.appendChild(recItem);
    }
    loadedRecommendations = maxLoad;

    // Sembunyikan tombol jika semua artikel telah dimuat
    if (loadedRecommendations >= allPosts.length) {
        document.getElementById("load-more").style.display = "none";
    }
}

// Fungsi untuk tombol "Lihat lebih banyak" di dalam postingan
function loadMoreRecommendations() {
    loadRecommendations();
}

// Muat postingan saat halaman utama terbuka
document.addEventListener("DOMContentLoaded", loadPosts);

                  
