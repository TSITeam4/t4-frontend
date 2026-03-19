'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../client';
import { classifyError } from '@/lib/error-utils';
import type { QueryError, QueryResult } from '@/types/database';

interface QueryFilter {
  column: string;
  operator: string;
  value: unknown;
}

interface QueryOptions {
  select?: string;
  orderBy?: string;
  ascending?: boolean;
  filters?: QueryFilter[];
  enabled?: boolean;
}

/**
 * Generic hook for Supabase SELECT queries with loading/error/data states.
 */
export function useSupabaseQuery<T>(
  table: string,
  options: QueryOptions = {}
): QueryResult<T> {
  const {
    select = '*',
    orderBy = 'display_order',
    ascending = true,
    filters = [],
    enabled = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<QueryError | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      for (const f of filters) {
        query = query.filter(f.column, f.operator, f.value);
      }

      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      const { data: rows, error: queryError } = await query;

      if (queryError) {
        setError(classifyError(queryError));
        setData([]);
      } else {
        setData((rows as T[]) ?? []);
        setError(null);
      }
    } catch (err) {
      setError(classifyError(err as Error));
      setData([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select, orderBy, ascending, JSON.stringify(filters), enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
