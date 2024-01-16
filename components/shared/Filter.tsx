'use client';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

export default function Filter({
  filters,
  otherClasses,
  containerClasses,
}: Props) {
  return (
    <div className={cn('relative', containerClasses)}>
      <Select>
        <SelectTrigger
          className={cn(
            otherClasses,
            'body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5'
          )}
        >
          <div className='line-clamp-1 flex-1 text-left'>
            <SelectValue placeholder='Theme' />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.name} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
