'use server';

import { connectToDatabase } from '@/lib/mongoose';

export async function createQuestion(params: any) {
  try {
    // connect to DB
    connectToDatabase();
  } catch (error) {}
}
