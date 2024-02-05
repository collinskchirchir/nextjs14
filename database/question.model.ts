import { Schema, models, model, Document } from 'mongoose';

// create an interface representing a document in MongoDB
export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  views: number;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  answers: Schema.Types.ObjectId[];
  createdAt: Date;
}

// create Schema corresponding to document interface
const QuestionSchema = new Schema({
  title: { type: String, require: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  views: { type: Number, default: 0 },
  upvotes: [{ types: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ types: Schema.Types.ObjectId, ref: 'User' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [{ types: Schema.Types.ObjectId, ref: 'Answer' }],
  createdAt: { type: Date, default: Date.now },
});
// create a model
const Question = models.Question || model('Question', QuestionSchema);

export default Question;
