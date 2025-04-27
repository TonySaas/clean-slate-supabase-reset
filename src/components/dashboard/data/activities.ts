
import { UserRound, Store, FileText } from 'lucide-react';

export const activities = [
  {
    id: '1',
    title: 'Supplier X added a new offer',
    time: '2 hours ago',
    icon: <FileText className="h-4 w-4 text-blue-500" />
  },
  {
    id: '2',
    title: 'Merchant Y joined the platform',
    time: '3 hours ago',
    icon: <Store className="h-4 w-4 text-purple-500" />
  },
  {
    id: '3',
    title: 'Campaign A ends soon',
    time: '5 hours ago',
    icon: <UserRound className="h-4 w-4 text-orange-500" />
  }
];
