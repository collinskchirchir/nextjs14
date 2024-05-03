'use server';
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from '@/lib/actions/shared.types';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/database/user. model';
import Tag, { ITag } from '@/database/tag.model';
import { FilterQuery } from 'mongoose';
import Question from '@/database/question.model';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    //   Find interactions for the user and group by tags...
    //   TODO: Interaction...
    return [
      { _id: '1', name: 'tag1' },
      { _id: '2', name: 'tag2' },
      { _id: '3', name: 'tag3' },
    ];
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();
    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Tag> = {};
    let sortOptions = {};
    switch (filter) {
      case 'popular':
        sortOptions = { questions: -1 };
        break;
      case 'recent':
        sortOptions = { createdOn: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'old':
        sortOptions = { createdOn: 1 };
        break;
    }
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, 'i') } }];
    }
    const tags = await Tag.find(query).sort(sortOptions);
    return { tags };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();
    // eslint-disable-next-line no-unused-vars
    const { tagId, searchQuery, page = 1, pageSize = 10 } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: 'questions',
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: 'i' } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: 'tags', model: Tag, select: '_id name' },
        { path: 'author', model: User, select: '_id clerkId name picture' },
      ],
    });
    if (!tag) {
      throw new Error('❌ Tag not found ❌');
    }
    const questions = tag.questions;
    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.error(`❌ ${error} ❌`);
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDatabase();
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } }, // descending order
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.error(`❌ ${error} ❌`);
  }
}
