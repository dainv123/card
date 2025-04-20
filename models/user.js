import mongoose from 'mongoose';
import { hash, compare } from 'bcryptjs';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      validate: [
        {
          validator: async function(email) {
            if (!this.isModified('email')) {
              return true;
            }

            const user = await User.findOne({ email });
            return !user || user._id.equals(this._id);
          },
          message: 'Email has already been taken.'
        }
      ]
    },
    username: {
      type: String,
      validate: {
        validator: async function(username) {
          if (!this.isModified('username')) {
            return true;
          }

          const user = await User.findOne({ username });
          return !user || user._id.equals(this._id);
        },
        message: () => 'Username has already been taken.'
      }
    },
    name: String,
    password: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: 'USER'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12);
  }
});

userSchema.statics.doesntExist = async function(options) {
  return (await this.where(options).countDocuments()) === 0;
};

userSchema.methods.matchesPassword = function(password) {
  return compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
