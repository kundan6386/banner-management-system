import Activity from '../models/activity.js';
import User from '../models/userModel.js';

export const saveActivity = async (user_id, type, type_id, activity) => {
    try {
        const newActivity = new Activity({
            user_id,
            type,
            type_id,
            activity
        });

        await newActivity.save();
        console.log('Activity saved successfully');
    } catch (error) {
        console.error('Error saving activity:', error);
        throw new Error('Failed to save activity');
    }
};

export const getActivity = async (req, res) => {
    const typeId = req.params.id;
  
    try {
        const activityList = await Activity.find({ type_id: typeId });
        const activityWithUserNames = await Promise.all(activityList.map(async activity => {
        const user = await User.findById(activity.user_id);
        const userName = user ? user.name : "Unknown"; // Assuming user object has a 'name' field
        return { ...activity.toObject(), userName };
      }));
      res.status(200).json(activityWithUserNames);
    } catch (error) {
      console.error('Error fetching activity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
