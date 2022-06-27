import { model, Schema } from 'mongoose';
import { Schemas } from '@Shared/infrastructure/http/mongodb/enums/schemas.enum';
import { UserRole } from '@Shared/domain/enums/user-role.enum';
import type { UserEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';

const userSchema = new Schema<UserEntity>(
  {
    _id: {
      type: String,
      required: true,
      _id: false,
    },
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
      default: UserRole.MEMBER,
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

export const User = model<UserEntity>(Schemas.USER, userSchema);
