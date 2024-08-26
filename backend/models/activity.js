import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    type_id: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
