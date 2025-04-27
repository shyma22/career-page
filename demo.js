// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentIndex = 0;
    const container = document.querySelector('.testimonial-container');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    // Touch variables
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    // Update carousel position
    function updateCarousel() {
      container.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
    
    // Go to specific slide - exposed as a global function for dot navigation
    window.currentSlide = function(index) {
      currentIndex = index;
      updateCarousel();
    };
    
    // Next/Prev buttons
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
      updateCarousel();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Touch events for swiping
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    // Handle swipe direction
    function handleSwipe() {
      const distance = touchStartX - touchEndX;
      
      if (Math.abs(distance) < minSwipeDistance) return;
      
      if (distance > 0) {
        // Swipe left - next slide
        currentIndex = (currentIndex < cards.length - 1) ? currentIndex + 1 : 0;
      } else {
        // Swipe right - previous slide
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : cards.length - 1;
      }
      
      updateCarousel();
    }
    
    // Mouse drag events
    let isDragging = false;
    let startPos = 0;
    
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      startPos = e.clientX;
      container.style.transition = 'none';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const currentPosition = e.clientX;
      const diff = currentPosition - startPos;
      const translate = -currentIndex * 100 + (diff / container.offsetWidth) * 100;
      container.style.transform = `translateX(${translate}%)`;
    });
    
    document.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.transition = 'transform 0.5s ease';
      
      const diff = e.clientX - startPos;
      if (Math.abs(diff) > container.offsetWidth / 4) {
        if (diff > 0 && currentIndex > 0) {
          currentIndex--;
        } else if (diff < 0 && currentIndex < cards.length - 1) {
          currentIndex++;
        }
      }
      
      updateCarousel();
    });
    
    // Form validation
    const feedbackForm = document.querySelector('form');
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', function(e) {
        const feedbackText = document.getElementById('feedback').value;
        const hasRating = document.querySelector('input[name="rating"]:checked');
        
        if (!feedbackText.trim() || !hasRating) {
          e.preventDefault();
          alert('Please provide both a rating and feedback before submitting.');
        }
      });
    }
  });