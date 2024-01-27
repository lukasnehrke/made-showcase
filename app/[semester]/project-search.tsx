'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/input';

export default function ProjectSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [searchParams]);

  const handleChange = (query: string): void => {
    setLoading(true);
    handleSearch(query);
  };

  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 450);

  return (
    <div className="relative w-full">
      {loading ? (
        <Loader2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        className="pl-9"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        placeholder="Search projects.."
        type="search"
      />
    </div>
  );
}
