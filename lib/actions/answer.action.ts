'use server';
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import Answer from '@/database/answer.model';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import Interaction from '@/database/iteraction.model';

import User from '@/database/user. model';

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
    const questionObj = await Question.findByIdAndUpdate(question, {
      $push: { answers: answer._id },
    });

    // Add interaction...
    await Interaction.create({
      user: author,
      action: 'answer',
      question: answer._id,
      tags: questionObj.tags,
    });

    // Increase user reputation 10+
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

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
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    // calculate skip amount
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};
    switch (sortBy) {
      case 'highestUpvotes':
        sortOptions = { upvotes: -1 };
        break;
      case 'lowestUpvotes':
        sortOptions = { upvotes: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
    }
    const answers = await Answer.find({ question: questionId })
      .populate('author', '_id clerkId name picture')
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const isNext = totalAnswers > skipAmount + answers.length;
    return { answers, isNext };
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

    // Increase user's reputation to +2 for upvoting a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    });
    // Increase authors reputation to +2 for upvoting a answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasUpvoted ? -2 : 2 },
    });
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
    // Increase user's reputation to +2 for downvoting a answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });
    // Increase authors reputation to +2 for downvoting a answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasDownvoted ? -2 : 2 },
    });

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
      { $pull: { answers: answerId } }
    );
    // Delete all interaction relative to the answer
    await Interaction.deleteMany({ answer: answerId });
    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}
