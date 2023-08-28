export interface UserNotification {
    id: string;
    tenantId?: number;
    userId: number;
    state: number;
    notification: NotificationData;
}
interface NotificationData {
    id: string;
    severity: number;
    notificationName: string;
    content: string;
    creationTime: Date;
}
