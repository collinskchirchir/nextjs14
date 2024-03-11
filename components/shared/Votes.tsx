'use client';
import React from 'react';
import Image from 'next/image';
import { formatAndDivideNumber } from '@/lib/utils';

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: Props) => {
  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        {/* UPVOTES */}
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasupVoted
                ? '/assets/icons/upvoted.svg'
                : '/assets/icons/upvote.svg'
            }
            alt='upvote'
            width={18}
            height={18}
            className='cursor-pointer'
            onClick={() => {}}
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
              hasdownVoted
                ? '/assets/icons/downvoted.svg'
                : '/assets/icons/downvote.svg'
            }
            alt='upvote'
            width={18}
            height={18}
            className='cursor-pointer'
            onClick={() => {}}
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
        onClick={() => {}}
      />
    </div>
  );
};

export default Votes;
