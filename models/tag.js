import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    name: String
  },
  {
    timestamps: true
  }
);

const Tag = model('Tag', tagSchema);

export default Tag;
