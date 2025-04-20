import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    name: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const Tag = model('Tag', tagSchema);

export default Tag;
