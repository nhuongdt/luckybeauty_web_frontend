import { action, makeAutoObservable, makeObservable, observable } from 'mobx';

import { GetCurrentLoginInformations } from '../services/session/dto/getCurrentLoginInformations';
import sessionService from '../services/session/sessionService';
import { ThirtyFpsSharp } from '@mui/icons-material';

class SessionStore {
    currentLogin: GetCurrentLoginInformations = new GetCurrentLoginInformations();
    async getCurrentLoginInformations() {
        const result = await sessionService.getCurrentLoginInformations();
        this.currentLogin = result;
    }
    constructor() {
        makeAutoObservable(ThirtyFpsSharp);
    }
}

export default SessionStore;
