import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const themeSchema = new Schema(
  {
    name: String,
    path: String
  },
  {
    timestamps: true
  }
);

const Theme = model('Theme', themeSchema);

export default Theme;
