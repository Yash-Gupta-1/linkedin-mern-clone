import mongoose from 'mongoose';

const linkedinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // photoUrl: {
    //     type: String,
    //     required: true,
    // },
})

export default mongoose.model("linkedinFeeds", linkedinSchema)