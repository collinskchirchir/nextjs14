import React from 'react';
import { getQuestionById } from '@/lib/actions/question.action';
import Image from 'next/image';
import Link from 'next/link';
import Metric from '@/components/shared/Metric';
import { formatAndDivideNumber, getTimestamp } from '@/lib/utils';
import ParseHTML from '@/components/shared/ParseHTML';
import RenderTag from '@/components/shared/RenderTag';
import Answer from '@/components/forms/Answer';

interface QuestionPageParams {
  params: { id: string };
}

const QuestionPage = async ({ params }: QuestionPageParams) => {
  // console.log(params);
  const question = await getQuestionById({ questionId: params.id });
  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${question.author.clerkId}`}
            className='flex items-center justify-start gap-1'
          >
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
          <div className='flex justify-end'>VOTING</div>
        </div>
        <h2 className='h2-semibold text-dark200_light900 mt-3.5 w-full text-left'>
          {question.title}
        </h2>
      </div>

      {/* Metrics Section */}
      <div className={'mb-8 mt-5 flex flex-wrap gap-4'}>
        <Metric
          imgUrl='/assets/icons/clock.svg'
          alt='clock icon'
          value={` asked ${getTimestamp(question.createdAt)}`}
          title='Asked'
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='Messages'
          value={formatAndDivideNumber(question.answers.length)}
          title='Answers'
          textStyles='small-medium text-dark400_light800'
        />
        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='Eye'
          value={formatAndDivideNumber(question.views)}
          title='Views'
          textStyles='small-medium text-dark400_light800'
        />
      </div>

      {/*  Question Content */}
      <ParseHTML data={question.content} />

      {/* Question Tags */}
      <div className='mt-8 flex flex-wrap gap-2'>
        {question.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      {/* Answer Form */}
      <Answer />
    </>
  );
};

export default QuestionPage;
