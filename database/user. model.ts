import { Schema, models, model, Document } from 'mongoose';

// create an interface representing a document in MongoDB
export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

// create Schema corresponding to document interface
const UserSchema = new Schema({
  clerkId: { type: String, require: true },
  name: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  email: { type: String, require: true, unique: true },
  password: { type: String },
  bio: { type: String },
  picture: { type: String, require: true },
  location: { type: String },
  portfolioWebsite: { type: String, require: true },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  joinedAt: { type: Date, default: Date.now },
});
// create a model
const User = models.User || model('User', UserSchema);

export default User;
