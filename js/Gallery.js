document.addEventListener("DOMContentLoaded", function() {
  var grid = document.querySelector('#gallery');
  if (grid && typeof Masonry === "function") {
    imagesLoaded(grid, function() {
      new Masonry(grid, {
        itemSelector: '.masonry-item',
        percentPosition: true,
        gutter: 16
      });
    });
  }
});