'use client';
import { HomePageFilters } from '@/constants/filters';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function HomeFilters() {
  const isActive = 'frequent';
  return (
    <div className='mt-10 flex-wrap gap-3 md:flex'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            isActive === item.value
              ? 'bg-primary-100 text-primary-500'
              : 'bg-light-800 text-light-500 dark:bg-dark-300 dark:text-light-500'
          }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
}
