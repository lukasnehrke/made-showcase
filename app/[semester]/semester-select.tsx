'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { semesters } from '@/lib/constants';
import { getPrettySemester } from '@/lib/utils';

export default function SemesterSelect() {
  const { semester } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleValueChange = (value: string): void => {
    const params = new URLSearchParams(searchParams);
    router.replace(`/${value}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleValueChange} value={String(semester)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Semester" />
      </SelectTrigger>
      <SelectContent
        ref={(ref) =>
          ref?.addEventListener('touchend', (e) => {
            e.preventDefault();
          })
        }
      >
        {semesters.map((item) => (
          <SelectItem key={item} value={item}>
            {getPrettySemester(item)}
          </SelectItem>
        ))}
        {typeof semester === 'string' && !semesters.includes(semester) && (
          <SelectItem value={semester}>{getPrettySemester(semester)}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
