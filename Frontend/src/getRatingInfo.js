import axios from 'axios';

const getRatingInfo = async (token, ratingType, relatedID) => {
    try {
        const response = await axios.get(
            `http://localhost:4000/api/ratings/getRatingInfo/${ratingType}/${relatedID}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
            return response.data; // Returns the rating data
        } else {
            console.error('Failed to fetch rating info');
        }
    } catch (error) {
        console.error('Error fetching rating info:', error);
    }
    return null; // Return null in case of an error
};

export default getRatingInfo;
