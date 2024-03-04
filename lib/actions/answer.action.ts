'use server';
import { CreateAnswerParams } from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import Answer from '@/database/answer.model';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();
    const { author, question, content, path } = params;
    const answer = new Answer({
      question,
      author,
      content,
    });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
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
