import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const themeSchema = new Schema(
  {
    name: String,
    path: String,
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      }
    ],
    image: {
      data: Buffer,
      contentType: String,
    }
  },
  {
    timestamps: true
  }
);

const Theme = model('Theme', themeSchema);

export default Theme;
