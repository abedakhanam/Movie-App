import { faker } from "@faker-js/faker";
import sequelize, { Genre, Movie, MovieGenre } from "./database";
import { Client as ElasticsearchClient } from "@elastic/elasticsearch";

// Elasticsearch setup
const esClient = new ElasticsearchClient({
  node: "https://localhost:9200/",
  auth: {
    username: "elastic",
    password: "cmSUa+=J61MaYudG_TiL",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const chunkSize = 100; // Adjust based on your system capacity
const totalMovies = 50000; // Total number of fake movies

// Define the types for Elasticsearch indexing
interface EsIndexMetadata {
  index: {
    _index: string;
    _id: string;
  };
}

interface EsMovieData {
  name: string;
  releaseYear: number;
  rating: number;
  thumbnailUrl: string;
  type: string;
  certificate: string;
  genres: string[];
  createdAt: string;
}

async function createElasticsearchIndex() {
  try {
    const indexExists = await esClient.indices.exists({ index: "movies" });
    if (!indexExists) {
      await esClient.indices.create({
        index: "movies",
        body: {
          mappings: {
            properties: {
              name: { type: "text" },
              releaseYear: { type: "integer" },
              rating: { type: "float" },
              thumbnailUrl: { type: "text" },
              type: { type: "keyword" },
              certificate: { type: "keyword" },
              genres: { type: "keyword" },
              createdAt: { type: "date" },
            },
          },
        },
      });
      console.log("Elasticsearch index created: movies");
    }
  } catch (error) {
    console.error("Error creating Elasticsearch index:", error);
  }
}

async function insertAndIndexMovies() {
  try {
    // Ensure connection to database and Elasticsearch
    await sequelize.authenticate();
    await esClient.ping();
    console.log("Connected to PostgreSQL and Elasticsearch.");

    // Create Elasticsearch index if it doesn't exist
    await createElasticsearchIndex();

    // Fetch all genres from the database
    const genres = await Genre.findAll();

    for (let i = 0; i < totalMovies; i += chunkSize) {
      const moviesData = [];
      const movieGenreData = [];

      // Declare esBody with correct types
      const esBody: (EsIndexMetadata | EsMovieData)[] = [];

      for (let j = 0; j < chunkSize && i + j < totalMovies; j++) {
        // Create movie data
        const movie = {
          name: `${faker.word.noun()} ${faker.word.noun()}`,
          releaseYear: faker.date.past({ years: 30 }).getFullYear(),
          rating: parseFloat((Math.random() * 10).toFixed(1)),
          thumbnailUrl: faker.image.url(),
          votes: faker.number.int({ min: 1000, max: 50000 }),
          duration: faker.number.int({ min: 90, max: 180 }),
          type: faker.helpers.arrayElement(["Film", "Series"]),
          certificate: faker.helpers.arrayElement([
            "PG-13",
            "R",
            "TV-MA",
            "TV-14",
            "TV-PG",
            "PG",
            "TV-G",
            "(Banned)",
            "Not Rated",
            "E",
            "NC-17",
            "TV-Y7-FV",
            "TV-Y7",
            "Unrated",
            "Approved",
            "G",
            "TV-Y",
            "GP",
            "Passed",
            "M",
            "X",
            "M/PG",
          ]),
          description: faker.lorem.paragraph(),
        };

        moviesData.push(movie);

        // Prepare the data for Elasticsearch indexing
        esBody.push(
          { index: { _index: "movies", _id: (i + j + 1).toString() } },
          {
            name: movie.name,
            releaseYear: movie.releaseYear,
            rating: movie.rating,
            thumbnailUrl: movie.thumbnailUrl,
            type: movie.type,
            certificate: movie.certificate,
            genres: [],
            createdAt: new Date().toISOString(),
          }
        );
      }

      // Insert movies in bulk and retrieve their IDs
      const createdMovies = await Movie.bulkCreate(moviesData, {
        ignoreDuplicates: true,
        returning: true, // Ensure that Sequelize returns the created movies with their IDs
      });

      // Now, for each created movie, assign genres
      for (const [index, createdMovie] of createdMovies.entries()) {
        // Randomly assign genres
        const randomGenres = faker.helpers.arrayElements(
          genres,
          faker.number.int({ min: 1, max: 3 })
        );

        // Add the genres to Elasticsearch data
        (esBody[index * 2 + 1] as EsMovieData).genres = randomGenres.map(
          (genre: any) => genre.genreName
        );

        // Create movie-genre relationship
        for (const genre of randomGenres) {
          movieGenreData.push({
            movieID: createdMovie.movieID, // Use the real movieID from the created record
            genreID: genre.genreID,
          });
        }
      }

      // Insert the movie-genre relationships in bulk
      await MovieGenre.bulkCreate(movieGenreData, { ignoreDuplicates: true });

      // Index the movies into Elasticsearch
      const bulkResponse = await esClient.bulk({
        refresh: true,
        body: esBody,
      });

      if (bulkResponse.errors) {
        const erroredDocuments: any[] = [];
        bulkResponse.items.forEach((action: any, idx: number) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: esBody[idx * 2],
              document: esBody[idx * 2 + 1],
            });
          }
        });
        console.error("Failed documents:", erroredDocuments);
      }

      console.log(`Inserted and indexed ${i + chunkSize} movies.`);
    }

    console.log(
      `${totalMovies} movies and their genres have been inserted and indexed.`
    );
  } catch (error) {
    console.error("Error inserting and indexing data:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

insertAndIndexMovies().catch(console.error);
//
//
///
//
//
//
//
//
//
//

//
//
//
//
//
//
//
//wroking file
// import { Client as ElasticsearchClient } from "@elastic/elasticsearch";
// import sequelize, { Movie, Genre } from './database';

// const esClient = new ElasticsearchClient({
//   node: "https://localhost:9200/",
//   auth: {
//     username: "elastic",
//     password: "cmSUa+=J61MaYudG_TiL",
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// const BATCH_SIZE = 1000; // Adjust based on your server's capacity

// async function createIndex() {
//   try {
//     const indexExists = await esClient.indices.exists({ index: "movies" });
//     if (!indexExists) {
//       await esClient.indices.create({
//         index: "movies",
//         body: {
//           mappings: {
//             properties: {
//               name: { type: "text" },
//               releaseYear: { type: "integer" },
//               rating: { type: "float" },
//               thumbnailUrl: { type: "text" },
//               type: { type: "keyword" },
//               certificate: { type: "keyword" },
//               genres: { type: "keyword" },
//               createdAt: { type: "date" },
//             },
//           },
//         },
//       });
//       console.log("Index created: movies");
//     }
//   } catch (error) {
//     console.error("Error creating index:", error);
//   }
// }

// async function indexMovies() {
//   try {
//     await esClient.ping();
//     console.log("Connected to Elasticsearch.");

//     await createIndex();

//     const totalCount = await Movie.count();
//     console.log(`Total movies to process: ${totalCount}`);

//     for (let offset = 0; offset < totalCount; offset += BATCH_SIZE) {
//       const movies = await Movie.findAll({
//         offset,
//         limit: BATCH_SIZE,
//         include: [{
//           model: Genre,
//           through: { attributes: [] },
//         }],
//       });

//       if (movies.length > 0) {
//         const body = movies.flatMap((movie: any) => [
//           { index: { _index: "movies", _id: movie.movieID.toString() } },
//           {
//             name: movie.name,
//             releaseYear: movie.releaseYear,
//             rating: movie.rating,
//             thumbnailUrl: movie.thumbnailUrl,
//             type: movie.type,
//             certificate: movie.certificate,
//             genres: movie.Genres ? movie.Genres.map((genre: any) => genre.genreName) : [],
//             createdAt: movie.createdAt,
//           },
//         ]);

//         const bulkResponse = await esClient.bulk({ refresh: true, body });

//         if (bulkResponse.errors) {
//           const erroredDocuments: any[] = [];
//           bulkResponse.items.forEach((action: any, i: number) => {
//             const operation = Object.keys(action)[0];
//             if (action[operation].error) {
//               erroredDocuments.push({
//                 status: action[operation].status,
//                 error: action[operation].error,
//                 operation: body[i * 2],
//                 document: body[i * 2 + 1]
//               });
//             }
//           });
//           console.error('Failed documents:', erroredDocuments);
//         }

//         console.log(`Indexed ${movies.length} movies. Total progress: ${offset + movies.length}/${totalCount}`);
//       } else {
//         console.log("No more movies to process.");
//         break;
//       }
//     }

//     console.log("Indexing complete.");
//   } catch (error) {
//     console.error("Error occurred:", error);
//   } finally {
//     await sequelize.close();
//     console.log("Database connection closed.");
//   }
// }

// indexMovies().catch(console.error);
//working file
//
//
//
//
//
//
//
//
