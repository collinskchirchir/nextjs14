'use server';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/database/user. model';
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from '@/lib/actions/shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';

export async function getUserById(params: any) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    await connectToDatabase();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error('User not found');
    }
    /**
     Delete user from database
     Delete linked questions, answers, comments, e.t.c
     */
    // get user question ids
    // eslint-disable-next-line no-unused-vars
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      '_id'
    );
    // delete user questions
    await Question.deleteMany({ author: user._id });
    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();

    // const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('❌ User not found ❌');
    }
    const isQuestionSaved = user.saved.includes(questionId);
    if (isQuestionSaved) {
      // remove from saved
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

// export async function getAllUsers(params: GetAllUsersParams) {
//   try {
//     await connectToDatabase();
//
//   } catch (error) {
//     console.error(`❌ ${error} ❌`);
//     throw error;
//   }
// }
