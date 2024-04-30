import React from 'react';
import { getQuestionsByTagId } from '@/lib/actions/tag.actions';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import QuestionCard from '@/components/cards/QuestionCard';
import NoResult from '@/components/shared/NoResult';
import { URLProps } from '@/types';

const TagDetailsPage = async ({ params, searchParams }: URLProps) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>
        {result && result.tagTitle}
      </h1>

      <div className='mt-11 w-full'>
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for tag questions'
          otherClasses='flex-1'
        />
      </div>

      {/*  QUESTION CARD section */}
      <div className='mt-10 flex w-full flex-col gap-6'>
        {/*  looping through questions */}
        {result && result.questions && result.questions.length > 0 ? (
          result.questions.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no tag question to show"
            description='Be the first to break the silence! Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get involved!'
            link='/'
            linkTitle='Save a Question'
          />
        )}
      </div>
      {/*  END OF QUESTION CARD section */}
    </>
  );
};

export default TagDetailsPage;
