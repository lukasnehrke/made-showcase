'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select';

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
      <SelectContent>
        <SelectItem value="ss22">SS22</SelectItem>
        <SelectItem value="ws22">WS22/23</SelectItem>
      </SelectContent>
    </Select>
  );
}
