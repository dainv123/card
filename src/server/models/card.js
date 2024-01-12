import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    themeId: {
      type: Schema.Types.ObjectId,
      ref: 'Theme',
      required: true
    },
    config: String
  },
  {
    timestamps: true
  }
);

const Card = model('Card', cardSchema);

export default Card;
