import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { classifyError } from '../errorUtils';

/**
 * Generic hook for Supabase SELECT queries with loading/error/data states.
 *
 * @param {string}   table      - Table name (e.g., 'events')
 * @param {object}   [options]
 * @param {string}   [options.select]     - Columns to select (default '*')
 * @param {string}   [options.orderBy]    - Column to order by (default 'display_order')
 * @param {boolean}  [options.ascending]  - Order direction (default true)
 * @param {Array}    [options.filters]    - Array of { column, operator, value } filters
 * @param {boolean}  [options.enabled]    - Whether to run the query (default true)
 *
 * @returns {{ data: Array, loading: boolean, error: object|null, refetch: Function }}
 */
export function useSupabaseQuery(table, options = {}) {
  const {
    select = '*',
    orderBy = 'display_order',
    ascending = true,
    filters = [],
    enabled = true,
  } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase.from(table).select(select);

      // Apply filters
      for (const f of filters) {
        query = query.filter(f.column, f.operator, f.value);
      }

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy, { ascending });
      }

      const { data: rows, error: queryError } = await query;

      if (queryError) {
        setError(classifyError(queryError));
        setData([]);
      } else {
        setData(rows ?? []);
        setError(null);
      }
    } catch (err) {
      setError(classifyError(err));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [table, select, orderBy, ascending, JSON.stringify(filters), enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
