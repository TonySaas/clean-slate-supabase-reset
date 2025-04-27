
import { Card, CardContent } from "@/components/ui/card";
import { activities } from './data/activities';

export function DashboardActivity() {
  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="mt-0.5">{activity.icon}</div>
              <div>
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
