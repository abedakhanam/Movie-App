import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import sequelize, { Genre, Movie, MovieGenre } from "./database";

// const csvFilePath = path.join(__dirname, "imdb.csv");
// // Helper function to parse numbers safely
// function parseNumber(value: string | undefined | null): number | null {
//   if (
//     value === undefined ||
//     value === null ||
//     value === "NaN" ||
//     value === "No Rate"
//   ) {
//     return null;
//   }
//   const number = parseFloat(value);
//   return isNaN(number) ? null : number;
// }

// // Helper function to parse integers safely
// function parseInteger(value: string | undefined | null): number | null {
//   if (
//     value === undefined ||
//     value === null ||
//     value === "NaN" ||
//     value === "No Rate"
//   ) {
//     return null;
//   }
//   const integer = parseInt(value, 10);
//   return isNaN(integer) ? null : integer;
// }

// // Function to insert or fetch genre from the database
// async function getOrCreateGenre(genreName: string): Promise<number> {
//   if (!genreName) return -1; // Return -1 for null/empty genres
//   const [genre, created] = await Genre.findOrCreate({
//     where: { genreName },
//   });
//   return genre.genreID;
// }

// // Function to migrate the CSV data to the database
// async function migrateData() {
//   const results: any[] = [];

//   // Read and parse the CSV file
//   fs.createReadStream(csvFilePath)
//     .pipe(csvParser())
//     .on("data", (data) => {
//       results.push(data);
//     })
//     .on("end", async () => {
//       try {
//         // Start transaction
//         const transaction = await sequelize.transaction();

//         // Process each row in the CSV file
//         for (const row of results) {
//           // Insert movie into the Movies table
//           const movie = await Movie.create(
//             {
//               name: row.Name,
//               releaseYear: parseInteger(row.Date),
//               rating: parseNumber(row.Rate),
//               thumbnailUrl: null, // Assuming no URL from CSV
//               votes: parseInteger(row.Votes),
//               duration: parseNumber(row.Duration),
//               type: row.Type,
//               certificate: row.Certificate,
//               episodes:
//                 row.Episodes !== "-" ? parseInteger(row.Episodes) : null,
//               nudity: row.Nudity,
//               violence: row.Violence,
//               profanity: row.Profanity,
//               alcohol: row.Alcohol,
//               frightening: row.Frightening,
//               description: null, // Assuming no description from CSV
//             },
//             { transaction }
//           );

//           // Insert genres into the Genres table and link with movies
//           const genre1ID = await getOrCreateGenre(row.Genre);
//           const genre2ID = await getOrCreateGenre(row["Genre 2"]);
//           const genre3ID = await getOrCreateGenre(row["Genre 3"]);

//           // Link movie to genres using the MovieGenre table
//           if (genre1ID !== -1) {
//             await MovieGenre.create(
//               { movieID: movie.movieID, genreID: genre1ID },
//               { transaction }
//             );
//           }
//           if (genre2ID !== -1) {
//             await MovieGenre.create(
//               { movieID: movie.movieID, genreID: genre2ID },
//               { transaction }
//             );
//           }
//           if (genre3ID !== -1) {
//             await MovieGenre.create(
//               { movieID: movie.movieID, genreID: genre3ID },
//               { transaction }
//             );
//           }
//         }

//         // Commit transaction
//         await transaction.commit();
//         console.log("Data migration completed successfully.");
//       } catch (error) {
//         console.error("Error during migration: ", error);
//       }
//     });
// }

// // Execute the migration script
// migrateData();

const csvFilePath = path.join(__dirname, "movies_with_posters.csv");

// Default thumbnail URL
const defaultThumbnailUrl =
  "https://res.cloudinary.com/di835w1z1/image/upload/v1726501367/samples/chair-and-coffee-table.jpg";

// Function to migrate the CSV data to the movie table
async function migrateThumbnails() {
  const results: any[] = [];

  // Read and parse the CSV file
  fs.createReadStream(csvFilePath)
    .pipe(csvParser())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", async () => {
      try {
        // Start transaction
        const transaction = await sequelize.transaction();

        // Process each row in the CSV file
        for (const row of results) {
          // Find the movie by name
          const movie = await Movie.findOne({
            where: { name: row.name },
            transaction,
          });

          // If movie exists, update the thumbnail URL
          if (movie) {
            const newThumbnailUrl = row.thumbnailUrl || defaultThumbnailUrl;

            await movie.update(
              {
                thumbnailUrl: newThumbnailUrl,
              },
              { transaction }
            );
            console.log(
              `Updated movie "${row.name}" with thumbnail: ${newThumbnailUrl}`
            );
          } else {
            // If movie is not found, assign default thumbnail URL
            console.log(
              `Movie "${row.name}" not found, setting default thumbnail URL.`
            );
          }
        }

        // Commit transaction
        await transaction.commit();
        console.log("Thumbnail migration completed successfully.");
      } catch (error) {
        console.error("Error during thumbnail migration: ", error);
      }
    });
}

// Execute the migration script
migrateThumbnails();

// UPDATE public."Movies"
// SET "thumbnailUrl" = 'https://res.cloudinary.com/di835w1z1/image/upload/v1726501367/samples/chair-and-coffee-table.jpg'
// WHERE "thumbnailUrl" IS NULL;