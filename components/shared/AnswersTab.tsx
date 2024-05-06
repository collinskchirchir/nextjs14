import React from 'react';
import { SearchParamsProps } from '@/types';
import { getUserAnswers } from '@/lib/actions/user.action';
import AnswerCard from '@/components/cards/AnswerCard';
import PaginationComponent from '@/components/Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });
  console.log(result.answers);
  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
      <div className='mt-10'>
        <PaginationComponent
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext || false}
        />
      </div>
    </>
  );
};

export default AnswersTab;
