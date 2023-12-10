import axios from 'axios';

export const postRating = async (token, ratingType, relatedID, rating) => {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/ratings/rateContent',
            { ratingType, relatedID, rating },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        if (response.data.success) {
            alert("Rating submitted successfully!");
        } else {
            alert("Failed to submit rating.");
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        alert('An error occurred while submitting the rating.');
    }
};
