'use client';
import React from 'react';
import Image from 'next/image';
import { formatAndDivideNumber } from '@/lib/utils';
import {
  downvoteQuestion,
  upvoteQuestion,
} from '@/lib/actions/question.action';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasUpvoted: boolean;
  downvotes: number;
  hasDownvoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasUpvoted,
  hasDownvoted,
  hasSaved,
}: Props) => {
  const pathName = usePathname();
  const router = useRouter();
  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    /** DOWN VOTE LOGIC */
    if (action === 'upvote') {
      if (type === 'Question') {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathName,
        });
      } else if (type === 'Answer') {
        // await upvoteAnswer({
        //   questionId: JSON.parse(itemId),
        //   userId: JSON.parse(userId),
        //   hasUpvoted,
        //   hasDownvoted,
        //   path: pathName,
        // });
      }
      // TODO: show a toast
    }

    /** DOWN VOTE LOGIC */
    if (action === 'downvote') {
      if (type === 'Question') {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpvoted,
          hasDownvoted,
          path: pathName,
        });
      } else if (type === 'Answer') {
        // await downvoteAnswer({
        //   questionId: JSON.parse(itemId),
        //   userId: JSON.parse(userId),
        //   hasUpvoted,
        //   hasDownvoted,
        //   path: pathName,
        // });
      }
      // TODO: show a toast
    }
  };

  const handleSave = () => {};

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        {/* UPVOTES */}
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasUpvoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            alt='upvote'
            width={18}
            height={18}
            className='cursor-pointer'
            onClick={() => handleVote('upvote')}
          />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        {/* DOWNVOTES */}
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasDownvoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            alt='downvote'
            width={18}
            height={18}
            className='cursor-pointer'
            onClick={() => handleVote('downvote')}
          />
          <div className='flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      {/* SAVED */}
      <Image
        src={
          hasSaved
            ? '/assets/icons/star-filled.svg'
            : '/assets/icons/star-red.svg'
        }
        alt='star'
        width={18}
        height={18}
        className='cursor-pointer'
        onClick={() => handleSave}
      />
    </div>
  );
};
export default Votes;
