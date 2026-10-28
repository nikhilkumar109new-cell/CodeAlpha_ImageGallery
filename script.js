const photos = [
  { title: 'Quiet Morning', category: 'nature', src: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85', alt: 'Golden sunrise over a misty green landscape' },
  { title: 'Into the Wild', category: 'nature', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85', alt: 'Sunlight filtering through a lush forest' },
  { title: 'Mountain Air', category: 'travel', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85', alt: 'Mountain peaks rising above a valley' },
  { title: 'Lines & Light', category: 'architecture', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85', alt: 'Minimal modern white architecture against the sky' },
  { title: 'Open Road', category: 'travel', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85', alt: 'Scenic landscape with a winding path' },
  { title: 'Urban Geometry', category: 'architecture', src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=85', alt: 'Geometric modern building facade' },
  { title: 'Into the Blue', category: 'nature', src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85', alt: 'Ocean waves rolling toward the shore' },
  { title: 'City Stories', category: 'architecture', src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1000&q=85', alt: 'City skyline at dusk' },
  { title: 'Faraway Place', category: 'travel', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=85', alt: 'Traveler looking across a dramatic open landscape' },
  { title: 'Green Escape', category: 'nature', src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85', alt: 'Dense green forest with a peaceful trail' },
  { title: 'Concrete Poetry', category: 'architecture', src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85', alt: 'Sculptural contemporary building lines' },
  { title: 'The Long Way', category: 'travel', src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85', alt: 'Lake and mountains reflected in calm water' }
];

const gallery = document.getElementById('gallery');
const resultCount = document.getElementById('result-count');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxIndex = document.getElementById('lightbox-index');
const filterButtons = document.querySelectorAll('.filter');

let activeFilter = 'all';
let visiblePhotos = [...photos];
let currentIndex = 0;
let lastFocusedElement = null;

function renderGallery() {
  gallery.innerHTML = '';
  visiblePhotos = photos.filter(photo => activeFilter === 'all' || photo.category === activeFilter);
  visiblePhotos.forEach((photo, index) => {
    const card = document.createElement('button');
    card.className = 'photo-card';
    card.type = 'button';
    card.setAttribute('aria-label', `Open ${photo.title}, ${photo.category}`);
    card.style.animationDelay = `${Math.min(index * 35, 300)}ms`;

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = 'lazy';

    const info = document.createElement('span');
    info.className = 'photo-info';
    const category = document.createElement('span');
    category.className = 'photo-category';
    category.textContent = photo.category;
    const title = document.createElement('span');
    title.className = 'photo-title';
    title.textContent = photo.title;

    info.append(category, title);
    card.append(img, info);
    card.addEventListener('click', () => openLightbox(index, card));
    gallery.append(card);
  });
  resultCount.textContent = `${visiblePhotos.length} photograph${visiblePhotos.length === 1 ? '' : 's'}`;
}

function setFilter(filter) {
  activeFilter = filter;
  filterButtons.forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderGallery();
}

function openLightbox(index, trigger) {
  currentIndex = index;
  lastFocusedElement = trigger || document.activeElement;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.getElementById('close-lightbox').focus();
}

function updateLightbox() {
  const photo = visiblePhotos[currentIndex];
  if (!photo) return;
  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.alt;
  lightboxTitle.textContent = photo.title;
  lightboxCategory.textContent = photo.category;
  lightboxIndex.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
}

function navigateLightbox(direction) {
  currentIndex = (currentIndex + direction + visiblePhotos.length) % visiblePhotos.length;
  updateLightbox();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedElement) lastFocusedElement.focus();
}

filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
document.getElementById('prev-image').addEventListener('click', () => navigateLightbox(-1));
document.getElementById('next-image').addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') navigateLightbox(-1);
  if (event.key === 'ArrowRight') navigateLightbox(1);
});

renderGallery();
