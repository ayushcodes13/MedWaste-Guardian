const imageInput = document.querySelector('#image-input');
const dropZone = document.querySelector('#drop-zone');
const previewPlaceholder = document.querySelector('.result-placeholder');
const imagePreview = document.querySelector('#image-preview');
const previewImage = document.querySelector('#preview-image');
const fileName = document.querySelector('#file-name');
const fileSize = document.querySelector('#file-size');
const analysisTitle = document.querySelector('#analysis-title');
const analysisCopy = document.querySelector('#analysis-copy');
const errorMessage = document.querySelector('#error-message');
const clearButton = document.querySelector('#clear-image');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
let activeObjectUrl = null;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function clearError() {
  errorMessage.hidden = true;
  errorMessage.textContent = '';
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function clearImage() {
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = null;
  imageInput.value = '';
  previewImage.removeAttribute('src');
  imagePreview.hidden = true;
  previewPlaceholder.hidden = false;
  analysisTitle.textContent = 'No analysis will run';
  analysisCopy.textContent = 'This public site is a static presentation. The YOLO model and retrieval backend are not deployed.';
  clearError();
}

function previewFile(file) {
  clearError();
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    clearImage();
    showError('Choose a PNG, JPG, or WebP image.');
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    clearImage();
    showError('This preview accepts images up to 8 MB.');
    return;
  }
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
  activeObjectUrl = URL.createObjectURL(file);
  previewImage.src = activeObjectUrl;
  fileName.textContent = file.name;
  fileSize.textContent = formatBytes(file.size);
  previewPlaceholder.hidden = true;
  imagePreview.hidden = false;
  analysisTitle.textContent = 'Image preview ready · no model run';
  analysisCopy.textContent = 'Your file stays in this browser. This website does not classify images or generate disposal guidance.';
}

imageInput.addEventListener('change', () => previewFile(imageInput.files?.[0]));
clearButton.addEventListener('click', clearImage);

for (const eventName of ['dragenter', 'dragover']) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.add('is-over');
  });
}
for (const eventName of ['dragleave', 'drop']) {
  dropZone.addEventListener(eventName, event => {
    event.preventDefault();
    dropZone.classList.remove('is-over');
  });
}
dropZone.addEventListener('drop', event => previewFile(event.dataTransfer?.files?.[0]));
dropZone.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    imageInput.click();
  }
});

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mobileNav.hidden = isOpen;
});
mobileNav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
});
window.addEventListener('beforeunload', () => {
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
});
