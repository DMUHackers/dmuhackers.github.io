
// As we are generating a static site there needs to be a helper file that specifies all the images we should pull it
// This comes with the benefit that the images can be called whatever we would like
// See GalleryList.json for images that are being polled
async function fetchImagesFromFolder(folderPath) {
    const response = await fetch(`img/gallery/GalleryList.json`);
    if (!response.ok) {
        throw new Error('Could not fetch image list');
    }
    const images = await response.json();
    return images.map(img => `${folderPath}/${img}`);
}

// Initialize Masonry after images are loaded
function applyMasonry(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const images = container.getElementsByTagName('img');

    let loadedCount = 0;
    const total = images.length;
    if (total === 0) return;

    for (let img of images) {
        if (img.complete) {
            loadedCount++;
            if (loadedCount === total) {
                new Masonry(container, {
                    itemSelector: '.col-sm-6.col-md-4.mb-4',
                    percentPosition: true
                });
            }
        } else {
            img.onload = () => {
                loadedCount++;
                if (loadedCount === total) {
                    new Masonry(container, {
                        itemSelector: '.col-sm-6.col-md-4.mb-4',
                        percentPosition: true
                    });
                }
            };
        }
    }
}

// Generate the image tiles and add them to the container
// Each image is within its own div allowing for Masonry to lay them out as necessary
async function displayGallery(folderPath, containerId) {
    try {
        const imageUrls = await fetchImagesFromFolder(folderPath);
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        imageUrls.forEach(url => {
            const wrapper = document.createElement('div');
            wrapper.className = 'col-sm-6 col-md-4 mb-4';
            const img = document.createElement('img');
            img.src = url;
            img.className = 'img-fluid rounded shadow-sm';
            wrapper.appendChild(img);
            container.appendChild(wrapper);
        });
        applyMasonry(containerId);
    } catch (err) {
        // If there is an error don't bother doing anything as we are likely running on a users machine
        // For development add log lines here for errors
        // console.log(err)
    }
}

displayGallery('img/gallery/', 'gallery');