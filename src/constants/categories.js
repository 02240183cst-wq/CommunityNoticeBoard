export const categories = [
  { name: 'Announcements', icon: 'megaphone-outline', color: '#2563EB', bg: '#DBEAFE' },
  { name: 'Lost & Found', icon: 'search-outline', color: '#D97706', bg: '#FEF3C7' },
  { name: 'Events', icon: 'calendar-outline', color: '#16A34A', bg: '#DCFCE7' },
  { name: 'Local Services', icon: 'construct-outline', color: '#7C3AED', bg: '#EDE9FE' },
  { name: 'Emergency', icon: 'warning-outline', color: '#DC2626', bg: '#FEE2E2' },
  { name: 'Community Help', icon: 'people-outline', color: '#0D9488', bg: '#CCFBF1' },
  { name: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#4B5563', bg: '#E5E7EB' },
];

export const getCategory = (name) =>
  categories.find((c) => c.name === name) || categories[categories.length - 1];

export const statusOptions = {
  'Lost & Found': ['Lost', 'Found', 'Resolved'],
  Events: ['Upcoming', 'Ongoing', 'Completed'],
  'Local Services': ['Available', 'Unavailable'],
};

export const getStatuses = (category) => statusOptions[category] || [];

// Returns the notice's status, or the first option if none is set. null if the category has no status.
export const getStatus = (notice) => {
  const list = getStatuses(notice.category);
  if (!list.length) return null;
  return list.includes(notice.status) ? notice.status : list[0];
};

export const statusColor = (s) => {
  switch (s) {
    case 'Lost':
      return '#D97706';
    case 'Found':
    case 'Ongoing':
    case 'Available':
      return '#16A34A';
    case 'Upcoming':
      return '#2563EB';
    case 'Unavailable':
      return '#DC2626';
    default:
      return '#6B7280';
  }
};