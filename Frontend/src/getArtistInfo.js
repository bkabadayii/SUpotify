import axios from 'axios';

export const getArtistInfo = async (token, artistID) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/content/getArtist/${artistID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.success ? response.data.artist : null;
    } catch (error) {
        console.error('Error fetching artist details:', error);
        return null;
    }
};