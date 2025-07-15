const loadMovies = async () => {
  const res = await fetch('movies.json');
  return await res.json();
};

const renderMovies = async () => {
  const allMovies = await loadMovies();
  const search = document.getElementById('searchInput')?.value?.toLowerCase() || "";
  const filtered = allMovies.filter(m => m.title.toLowerCase().includes(search));
  const page = window.currentPage || 1;
  const perPage = 20;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const movieGrid = document.getElementById('movieGrid');
  if (movieGrid) {
    movieGrid.innerHTML = paged.map(m =>
      `<div class="movie-card">
         <h3>${m.title}</h3>
         <a href="${m.downloadUrl}" target="_blank">📥 Download</a>
       </div>`
    ).join('');
  }

  const totalPages = Math.ceil(filtered.length / perPage);
  const pagination = document.getElementById('pagination');
  if (pagination) {
    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) =>
      `<button onclick="goToPage(${i + 1})">${i + 1}</button>`
    ).join(' ');
  }
};

function goToPage(page) {
  window.currentPage = page;
  renderMovies();
}

document.getElementById('searchInput')?.addEventListener('input', () => {
  window.currentPage = 1;
  renderMovies();
});

document.getElementById('movieForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('movieTitle').value;
  const url = document.getElementById('movieUrl').value;

  const res = await fetch('movies.json');
  const movies = await res.json();
  movies.push({ title, downloadUrl: url });

  const blob = new Blob([JSON.stringify(movies, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'movies.json';
  a.click();
});
