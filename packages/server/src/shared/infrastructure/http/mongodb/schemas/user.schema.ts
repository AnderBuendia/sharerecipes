import { model, Schema, Model } from 'mongoose';
import { UserEntity } from '@Shared/infrastructure/http/mongodb/interfaces/documents/user-document.interface';
import { Schemas } from '@Shared/infrastructure/http/mongodb/enums/schemas.enum';
import { UserRole } from '@Shared/domain/enums/user-role.enum';

const userSchema: Schema = new Schema(
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

export const User: Model<UserEntity> = model(Schemas.USER, userSchema);
