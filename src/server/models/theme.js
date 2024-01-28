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
    // image: {
    //   name: String,
    //   data: Buffer,
    //   contentType: String,
    // }
    image: String
  },
  {
    timestamps: true
  }
);

const Theme = model('Theme', themeSchema);

export default Theme;
