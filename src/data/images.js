// Image pool for the barbershop website
// ALL photos from 3Y4A series included
// Owner photo (3Y4A9599.jpg) is first, then all other barbers
export const imagePool = [
  "/3Y4A9599.jpg", // Owner - FIRST PLACE
  "/3Y4A9678.jpg",
  "/3Y4A0007.jpg",
  "/3Y4A0018.jpg",
  "/3Y4A9377.jpg",
  "/3Y4A9384.jpg",
  "/3Y4A9387.jpg",
  "/3Y4A9445.jpg",
  "/3Y4A9468.jpg",
  "/3Y4A9474.jpg",
  "/3Y4A9514.jpg",
  "/3Y4A9531.jpg",
  "/3Y4A9540.jpg",
  "/3Y4A9543.jpg",
  "/3Y4A9564.jpg",
  "/3Y4A9569.jpg",
  "/3Y4A959Y.jpg",
  "/3Y4A9602.jpg",
  "/3Y4A9606.jpg",
  "/3Y4A9632.jpg",
  "/3Y4A9638.jpg",
  "/3Y4A9642.jpg",
  "/3Y4A9663.jpg",
  "/3Y4A9672.jpg",
  "/3Y4A9695.jpg",
  "/3Y4A9701.jpg",
  "/3Y4A9706.jpg",
  "/3Y4A9709.jpg",
  "/3Y4A9712.jpg",
  "/3Y4A9717.jpg",
  "/3Y4A9719.jpg",
  "/3Y4A9733.jpg",
  "/3Y4A9751.jpg",
  "/3Y4A9763.jpg",
  "/3Y4A9781.jpg",
  "/3Y4A9824.jpg",
  "/3Y4A9838.jpg",
  "/3Y4A9844.jpg",
  "/3Y4A9847.jpg",
  "/3Y4A9885.jpg",
  "/3Y4A9893.jpg",
  "/3Y4A9898.jpg",
  "/3Y4A989Y.jpg",
  "/3Y4A9905.jpg",
  "/3Y4A9908.jpg",
  "/3Y4A9923.jpg",
  "/3Y4A9943.jpg",
  "/3Y4A9955.jpg",
  "/3Y4A9970.jpg",
  "/3Y4A9988.jpg",
  // Legacy images (kept for backward compatibility)
  "/5273736187975765549_121.jpg",
  "/5273736187975765548_121.jpg",
  "/5273736187975765550_121.jpg",
  "/Screenshot 2025-11-26 175000.png",
  "/Screenshot 2025-11-26 175006.png",
  "/Screenshot 2025-11-26 175015.png",
  "/Screenshot 2025-11-26 175026.png",
];

// Get random images from the pool
export const getRandomImages = (count) => {
  const shuffled = [...imagePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get images in order (cycling through the pool)
// Uses only the 3Y4A series photos (first 48 photos)
export const getImagesInOrder = (count) => {
  const result = [];
  // Get only the 3Y4A series photos (first 48 photos, excluding legacy images)
  const barberPhotos = imagePool.slice(0, 48);
  for (let i = 0; i < count; i++) {
    result.push(barberPhotos[i % barberPhotos.length]);
  }
  return result;
};

// Get all barber photos (3Y4A series only - all 48 photos)
export const getAllBarberPhotos = () => {
  return imagePool.slice(0, 48);
};
