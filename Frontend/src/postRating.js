import axios from 'axios';
import { toast } from 'react-toastify';


export const postRating = async (token, ratingType, relatedID, rating) => {
    try {
        const response = await axios.post(
            'http://localhost:4000/api/ratings/rateContent',
            { ratingType, relatedID, rating },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response);
        if (response.data.success) {
            toast.success("Rating submitted successfully!");
        } else {
            toast.error("Failed to submit rating.");
        }
    } catch (error) {
        console.error('Error submitting rating:', error);
        toast.error('An error occurred while submitting the rating.');
    }
};
