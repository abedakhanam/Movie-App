// const createTestData = async () => {
//   try {
//     // Create a genre
//     const genre = await Genre.create({
//       genreName: "Action",
//     });

//     // Create a movie
//     const movie = await Movie.create({
//       name: "Inception",
//       releaseYear: 2010,
//       rating: 8.8,
//       type: "Film",
//       certificate: "PG-13",
//     });

//     // Associate the movie with the genre
//     await (movie as any).addGenre(genre); // Ensure this is awaited

//     console.log("Movie and Genre association created!");
//   } catch (error) {
//     console.error("Error creating test data:", error);
//   }
// };

// // Call the function to create and associate data
// createTestData();

// Function to create test data
// const createTestData = async () => {
//   try {
//     await sequelize.sync({ force: true }); // This will drop tables and recreate them, use with caution in production

//     // Create genres
//     const genre1 = await Genre.create({
//       genreName: "Action",
//     });

//     const genre2 = await Genre.create({
//       genreName: "Science Fiction",
//     });

//     const genre3 = await Genre.create({
//       genreName: "Adventure",
//     });

//     // Create a movie
//     const movie = await Movie.create({
//       name: "Inception",
//       releaseYear: 2010,
//       rating: 8.8,
//       votes: 2100000,
//       duration: 148,
//       type: "Film",
//       certificate: "PG-13",
//       nudity: "Moderate",
//       violence: "Moderate",
//       profanity: "Mild",
//       alcohol: "Mild",
//       frightening: "Severe",
//       thumbnailUrl: "https://example.com/inception_thumbnail.jpg",
//       description:
//         "A mind-bending thriller where dreams within dreams take center stage.",
//     });
//     await (movie as any).addGenre([genre1, genre2, genre3]);
//     // Associate the movie with genres

//     // Create another movie
//     const movie2 = await Movie.create({
//       name: "Interstellar",
//       releaseYear: 2014,
//       rating: 8.6,
//       votes: 1500000,
//       duration: 169,
//       type: "Film",
//       certificate: "PG-13",
//       nudity: "Mild",
//       violence: "Mild",
//       profanity: "Moderate",
//       alcohol: "Mild",
//       frightening: "Moderate",
//       thumbnailUrl: "https://example.com/interstellar_thumbnail.jpg",
//       description:
//         "A space exploration epic where humanity's fate lies among the stars.",
//     });

//     // Associate the second movie with genres
//     await (movie2 as any).addGenres([genre1, genre3]);

//     console.log("Test data successfully created!");
//   } catch (error) {
//     console.error("Error creating test data:", error);
//   }
// };

// // Call the function to create and associate data
// createTestData();
