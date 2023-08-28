import { makeAutoObservable } from 'mobx';
import { GetNotificationsOutput } from '../services/notification/dto/GetNotificationsOutput';
import { GetUserNotificationsInput } from '../services/notification/dto/GetUserNotificationsInput';
import NotificationService from '../services/notification/NotificationService';

class NotificationStore {
    idNotification!: string;
    notifications!: GetNotificationsOutput;
    getNotificationInput!: GetUserNotificationsInput;
    constructor() {
        this.getNotificationInput = {
            maxResultCount: 3,
            skipCount: 0
        };
        makeAutoObservable(this);
    }
    async GetUserNotification() {
        const data = await NotificationService.GetNotifiationByCurrentUser(
            this.getNotificationInput
        );
        this.notifications = data;
    }
}
export default new NotificationStore();
