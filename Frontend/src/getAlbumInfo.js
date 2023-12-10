import axios from 'axios';

export const getAlbumInfo = async (token, albumID) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/content/getAlbum/${albumID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.success ? response.data.album : null;
    } catch (error) {
        console.error('Error fetching album details:', error);
        return null;
    }
};