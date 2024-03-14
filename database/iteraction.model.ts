import { Schema, models, model, Document } from 'mongoose';

// create an interface representing a document in MongoDB
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // user ref
  action: string;
  question: Schema.Types.ObjectId; // question ref
  answer: Schema.Types.ObjectId; // answer ref
  tags: Schema.Types.ObjectId; // tag ref
  createdAt: Date;
}

// create Schema corresponding to document interface
const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: { type: Date, default: Date.now },
});
// create a model
const Interaction =
  models.Interaction || model('Interaction', InteractionSchema);

export default Interaction;
