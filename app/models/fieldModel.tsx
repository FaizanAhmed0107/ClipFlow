import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please enter text.']
    },
    refid: {
        type: String,
        required: [true, 'Please enter refid.']
    }
});

const Field = mongoose.models.Field || mongoose.model("Field", fieldSchema);

export default Field;