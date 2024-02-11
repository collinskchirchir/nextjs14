'use server';

import { connectToDatabase } from '@/lib/mongoose';
import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import {
  CreateQuestionParams,
  GetQuestionsParams,
} from '@/lib/actions/shared.types';
import User from '@/database/user. model';
import { revalidatePath } from 'next/cache';
import { sort } from 'next/dist/build/webpack/loaders/css-loader/src/utils';

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();
    const questions = await Question.find({})
      .populate({ path: 'tags', model: Tag })
      .populate({ path: 'author', model: User })
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    // connect to DB
    connectToDatabase();
    // 'path' is going to be the URL to the page we're going to reload
    const { title, content, tags, author, path } = params;
    // create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];
    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    // TODO: Create an interaction record for the user's ask_question action

    // TODO: Increment author's reputation by +5 for creating a question

    revalidatePath(path);
  } catch (error) {}
}
