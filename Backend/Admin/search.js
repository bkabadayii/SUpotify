const axios = require('axios');

require("dotenv").config();

const accessToken ="BQDIa-uQi_gICdqSiqfaNONG56lgbzGfNsKTesqgCE8LfhXjqoS0ebH8_xrtjv6VN7_g9Ga7lQvYSTbhLNfofYQvBh7tXc6TSu7KyATr5PblBhlOX5k";
const songTitle = 'Keskin Bıçak'; // Replace with the title of the song
const artistName ='İbrahim Tatlıses'; // Replace with the name of the artist


// Search for the song
axios.get(`https://api.spotify.com/v1/search`, {
  params: {
    q: `track:${songTitle} artist:${artistName}`,
    type: 'track',
  },
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  },
})
  .then(response => {
    // Extract the song ID from the response
    const songId = response.data.tracks.items[0].id; // Assuming you want the ID of the first match
    console.log(`The ID of the song is: ${songId}`);
  })
  .catch(error => {
    console.error('Error:', error);
  });
