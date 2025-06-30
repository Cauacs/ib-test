import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}


export function Notifications({ notifications, onRemove }: { notifications: Notification[]; onRemove: (id: string) => void }) {
  if (notifications.length === 0) return null;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-600" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex max-w-md items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getBackgroundColor(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="flex-1 text-sm font-medium">{notification.message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(notification.id)}
            className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
