import { model, Schema, Model } from 'mongoose';
import { IUser } from '@Interfaces/models/user.interface';

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: {
      type: String,
    },
    image_name: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'MEMBER',
    },
  },
  {
    timestamps: true,
  }
);

/* Remove the password when a query is made (for security). */
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

export const User: Model<IUser> = model('User', userSchema);
