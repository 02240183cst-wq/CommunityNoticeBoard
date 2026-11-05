export const defaultFilters = { sort: 'newest', dateRange: 'any', location: '' };

export const sortOptions = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'updated', label: 'Recently updated' },
];

export const dateOptions = [
  { key: 'any', label: 'Any time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Last 7 days' },
  { key: 'month', label: 'Last 30 days' },
];

const ms = (ts) => (ts && ts.toMillis ? ts.toMillis() : Date.now());
const DAY = 86400000;

export const activeFilterCount = (f) =>
  (f.sort !== 'newest' ? 1 : 0) +
  (f.dateRange !== 'any' ? 1 : 0) +
  (f.location.trim() ? 1 : 0);

export const applyFilters = (notices, { search = '', category = 'All', filters = defaultFilters }) => {
  const q = search.trim().toLowerCase();
  const loc = filters.location.trim().toLowerCase();
  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const list = notices.filter((n) => {
    if (category !== 'All' && n.category !== category) return false;
    if (
      q &&
      !(
        n.title?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q) ||
        n.location?.toLowerCase().includes(q)
      )
    )
      return false;
    if (loc && !n.location?.toLowerCase().includes(loc)) return false;

    const created = ms(n.createdAt);
    if (filters.dateRange === 'today' && created < startOfToday.getTime()) return false;
    if (filters.dateRange === 'week' && created < now - 7 * DAY) return false;
    if (filters.dateRange === 'month' && created < now - 30 * DAY) return false;
    return true;
  });

  list.sort((a, b) => {
    if (filters.sort === 'oldest') return ms(a.createdAt) - ms(b.createdAt);
    if (filters.sort === 'updated') return ms(b.updatedAt) - ms(a.updatedAt);
    return ms(b.createdAt) - ms(a.createdAt);
  });

  // Emergency notices always on top
  return [
    ...list.filter((n) => n.category === 'Emergency'),
    ...list.filter((n) => n.category !== 'Emergency'),
  ];
};