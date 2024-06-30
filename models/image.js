import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const imageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    image: String
  },
  {
    timestamps: true
  }
);

const Image = model('Image', imageSchema);

export default Image;
