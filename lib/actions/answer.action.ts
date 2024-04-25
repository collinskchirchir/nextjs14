'use server';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  DeleteQuestionParams,
  GetAnswersParams,
} from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import Answer from '@/database/answer.model';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Interaction from '@/database/iteraction.model';
import Tag from '@/database/tag.model';

export async function createAnswer(params: CreateAnswerParams) {
  try {
    await connectToDatabase();
    const { author, question, content, path } = params;
    const answer = await Answer.create({
      content,
      author,
      question,
    });

    // Add the answer to the question's answers array
    // eslint-disable-next-line no-unused-vars
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
export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();
    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    // form updateQuery
    let updateQuery = {};
    if (hasUpvoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownvoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error('Answer not found');
    }

    //   TODO: Increase author's reputation to +10 for upvoting a answer
    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    await connectToDatabase();
    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    // form updateQuery
    let updateQuery = {};
    if (hasDownvoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpvoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvote: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }
    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error('Answer not found');
    }

    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    await connectToDatabase();
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }
    await Answer.deleteOne({ _id: answerId });
    // remove references on tags to question
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answer._id } }
    );
    // Delete all interaction relative to the answer
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
