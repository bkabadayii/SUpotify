const axios = require("axios");

require("dotenv").config();

const accessToken =
    "BQCn-LjXx6trIIuX8VK40eNcdNmlR8EgjywRBPpf280Jv51KbbesKSgWlGTYXPhkCt9b8fbkU7pMxk5T4A6O9rJkvQiyACqlLjfF3hpA1auQrq5ynWY";
const albumTitle = "umbrellu";
const artist = "motive";

const artistStr = ``;
// const artistStr = ` artist:${artist}]`;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

// Define the CSV file path and header (if needed)
const csvFilePath = "./albums.csv";

// Function to append a row to the CSV file
const appendRowToCsv = async (data) => {
    // Check if the file already exists
    const fileExists = fs.existsSync(csvFilePath);

    // Create CSV writer instance
    const csvWriter = createCsvWriter({
        path: csvFilePath,
        header: ["artist_name", "album_name", "album_id"],
        append: true,
    });

    // Append the data to the CSV file
    console.log(data);
    await csvWriter.writeRecords([data]);
};

// Search for the album
axios
    .get(`https://api.spotify.com/v1/search`, {
        params: {
            q: `${albumTitle}${artistStr}`,
            type: "album,artist,track",
            limit: 5,
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    .then((response) => {
        const artistName = response.data.albums.items[0].artists[0].name;
        const albumName = response.data.albums.items[0].name;
        const albumID = response.data.albums.items[0].id;

        // console.log("ARTIST NAME: ", artistName);
        // console.log("ALBUM NAME:", albumName);
        // console.log("ALBUM ID:", albumID);
        console.log(
            "Tracks:",
            response.data.tracks.items.map((item) => {
                return {
                    name: item.name,
                    id: item.id,
                    artists: item.artists.map((artist) => artist.name),
                    albumName: item.album.name,
                    albumID: item.album.id,
                    image: item.album.images[0].url,
                };
            })
        );
        console.log(
            "Albums:",
            response.data.albums.items.map((item) => {
                return {
                    name: item.name,
                    id: item.id,
                    artists: item.artists.map((artist) => artist.name),
                    image: item.images[0].url,
                };
            })
        );
        console.log(
            "Artists:",
            response.data.artists.items.map((item) => {
                return {
                    name: item.name,
                    id: item.id,
                    image: item.images[0].url,
                };
            })
        );

        // Example data to append
        const rowData = {
            artist_name: artistName,
            album_name: albumName,
            album_id: albumID,
        };

        // Append the row to the CSV file
        // appendRowToCsv(rowData);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
