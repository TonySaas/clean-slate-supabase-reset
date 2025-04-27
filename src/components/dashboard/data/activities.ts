
import { UserRound, Store, FileText } from 'lucide-react';
import React from 'react';

// Define a type for our activities
export interface Activity {
  id: string;
  title: string;
  time: string;
  icon: React.ReactNode;
}

// Export a function that returns the activities with their icons
export const activities: Activity[] = [
  {
    id: '1',
    title: 'Supplier X added a new offer',
    time: '2 hours ago',
    icon: React.createElement(FileText, { className: "h-4 w-4 text-blue-500" })
  },
  {
    id: '2',
    title: 'Merchant Y joined the platform',
    time: '3 hours ago',
    icon: React.createElement(Store, { className: "h-4 w-4 text-purple-500" })
  },
  {
    id: '3',
    title: 'Campaign A ends soon',
    time: '5 hours ago',
    icon: React.createElement(UserRound, { className: "h-4 w-4 text-orange-500" })
  }
];
