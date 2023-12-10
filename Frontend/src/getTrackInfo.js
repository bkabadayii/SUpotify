import axios from 'axios';

export const getTrackInfo = async (token, trackID) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/content/getTrack/${trackID}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.success ? response.data.track : null;
    } catch (error) {
        console.error('Error fetching track details:', error);
        return null;
    }
};