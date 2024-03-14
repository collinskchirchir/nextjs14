'use server';
import { ViewQuestionParams } from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import Question from '@/database/question.model';
import Interaction from '@/database/iteraction.model';

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, userId } = params;
    // update view count for the question '$inc' means increament
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    // Check if user has already viewed that question
    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: 'view',
        question: questionId,
      });
      if (existingInteraction) return console.log('User has already viewed.');
      // Create Interaction
      await Interaction.create({
        user: userId,
        action: 'view',
        question: questionId,
      });
    }
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
