import React from 'react';
import { getQuestionById } from '@/lib/actions/question.action';
import Image from 'next/image';
import Link from 'next/link';
interface QuestionPageParams {
  params: { id: string };
}
const QuestionPage = async ({ params }: QuestionPageParams) => {
  // console.log(params);
  const question = await getQuestionById({ questionId: params.id });
  return (
    <div className='flex-start w-full flex-col'>
      <div>
        <Link href={`/profile/${question.author.clerkId}`}>
          <Image
            src={question.author.picture}
            alt='profile'
            className='rounded-full'
            height={22}
            width={22}
          />
          <p className='paragraph-semibold text-dark300_light700'>
            {question.author.name}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default QuestionPage;
