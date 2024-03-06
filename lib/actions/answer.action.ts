'use server';
import {
  CreateAnswerParams,
  GetAnswersParams,
} from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import Answer from '@/database/answer.model';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();
    const { author, question, content, path } = params;
    const answer = await Answer.create({
      question,
      author,
      content,
    });

    // Add the answer to the question's answers array
    // eslint-disable-next-line no-unused-vars
    const questionObject = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // TODO: Add interaction...

    // no need to return answer(it's like a refresh)
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    await connectToDatabase();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort({ createdAt: -1 });
    return { answers };
  } catch (error) {
    console.log(error);
  }
}
