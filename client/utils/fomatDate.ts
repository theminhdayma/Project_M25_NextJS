
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale'; 

const getVietnameseRelativeTime = (distance: string) => {
  const translations: Record<string, string> = {
    'less than a minute': 'vừa xong',
    'minutes': 'phút trước',
    'about an hour': '1 giờ trước',
    'hours': 'giờ trước',
    'a day': '1 ngày trước',
    'days': 'ngày trước',
    'about a month': '1 tháng trước',
    'months': 'tháng trước',
    'about a year': '1 năm trước',
    'years': 'năm trước',
  };
  return translations[distance] || distance;
};

export const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  const distance = formatDistanceToNow(date, { addSuffix: true, locale: vi });
  return getVietnameseRelativeTime(distance);
};
