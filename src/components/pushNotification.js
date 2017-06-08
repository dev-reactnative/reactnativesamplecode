/**
 * Created by ori on 30/01/17.
 */
'use strict';
import {Vibration, Alert} from 'react-native';
import FCM from 'react-native-fcm';
import {CHECK_IN_STATUSES, ENVELOPE_TYPES, SHIFT_ROLES, SWIPER_SCREEN_NAMES, REFRESH_TYPES, ROLES} from '../constants';
import Tts from 'react-native-tts';
import i18n from '../lib/i18n';
import inArray from 'in-array';
import log from '../lib/log';

export default function ({state, actions}) {

    try {
        FCM.getFCMToken().then(token => {
            state.auth.fcmToken = token;
            log(`fcm token ${token}`);
        });
        FCM.on('notification', (notif) => {
            log(`notif ${new Date()} ${JSON.stringify(notif)}`);
            // if (notif.fcm && Object.keys(notif.fcm).length > 0) {
            //     FCM.presentLocalNotification(Object.assign({show_in_foreground: true}, notif.fcm));
            // }
            if (notif.bravoEvent) {
                const decodedBravoEvent = decodeURIComponent(notif.bravoEvent);
                const envelope = JSON.parse(decodedBravoEvent);
                switch (envelope.type) {
                    case ENVELOPE_TYPES.CheckinStatusDTO:
                        state.auth.checkinPending = false;
                        state.auth.checkinPendingMessage = '';
                        const oldCheckinStatus = state.auth.checkinStatus;
                        state.auth.checkinStatus = envelope.payload;
                        if (oldCheckinStatus && oldCheckinStatus.status === CHECK_IN_STATUSES.CHECKED_IN && state.auth.checkinStatus.status === CHECK_IN_STATUSES.CHECKED_IN && oldCheckinStatus.shiftRole !== state.auth.checkinStatus.shiftRole) {
                            Alert.alert(
                                i18n.t('yourShiftRoleHasChangedTo') + state.auth.checkinStatus.shiftRoleLabel,
                                '',
                                [
                                    {text: i18n.t('acknowledge')},
                                ],
                                {cancelable: false}
                            );
                        }
                        if (state.auth.checkinStatus.status === CHECK_IN_STATUSES.CHECKED_OUT && state.auth.checkinStatus.shiftRole !== SHIFT_ROLES.PENDING) {
                            Vibration.vibrate();
                        }
                        if (
                            (!oldCheckinStatus || oldCheckinStatus.status !== state.auth.checkinStatus)
                            &&
                            state.auth.checkinStatus.status === CHECK_IN_STATUSES.CHECKED_IN
                            &&
                            state.auth.agentInfo
                            &&
                            state.auth.agentInfo.roleRequiresCheckin
                        ) {
                            Vibration.vibrate();
                            Tts.speak(i18n.t('checkingRequestApproved'));
                        }
                        // if (state.auth.checkinStatus.message === CHECKIN_MESSAGES.INVALID_INTERFACE_FOR_USER) {
                        //     state.ui.signin.error = 'errors.' + state.auth.checkinStatus.message;
                        //     state.auth.checkinStatus = state.auth.agentInfo = null;
                        //     CookieManager.clearAll((err, res) => {
                        //         console.log('cookies cleared!');
                        //         console.log(err);
                        //         console.log(res);
                        //     });
                        // }
                        break;
                    case ENVELOPE_TYPES.TaskDTO: {
                        if (state.auth.checkinStatus.status === CHECK_IN_STATUSES.CHECKED_IN) {
                            Vibration.vibrate([0, 500, 200, 500]);
                            Tts.speak(i18n.t('newTasksWaitingForYourReview'));
                        }
                        const unread = actions.swiper.getCurrentSwiperScreenName() !== SWIPER_SCREEN_NAMES.OPEN_TASKS;
                        state.tasks.list.push(Object.assign({}, envelope.payload, {
                            unread,
                            submitting: false,
                            submitted: false,
                            expanded: false,
                        }));
                        break;
                    }
                    case ENVELOPE_TYPES.TaskCancelledDTO:
                        const cancelledTasksIds = envelope.payload.tasks;
                        const newTasks = state.tasks.list.filter(task => !inArray(cancelledTasksIds, task.taskID));
                        const cancelledTasks = state.tasks.list.filter(task => inArray(cancelledTasksIds, task.taskID)).map(task => Object.assign({}, envelope.payload, {task}));
                        const newCancelledTasks = state.tasks.cancelledTasks.concat(cancelledTasks);
                        state.tasks.cancelledTasks.replace(newCancelledTasks);
                        state.tasks.list.replace(newTasks);
                        break;
                    case ENVELOPE_TYPES.JobDTO:
                        state.jobs.list.push(Object.assign({}, envelope.payload, {unread: true}));
                        break;
                    case ENVELOPE_TYPES.OpLogDTO:
                        if (state.history.visible) {
                            state.history.opLogs.push(Object.assign({}, envelope.payload, {unread: true}));
                        }
                        break;
                    case ENVELOPE_TYPES.CriticalIssueDTO:
                        const unread = actions.swiper.getCurrentSwiperScreenName() !== SWIPER_SCREEN_NAMES.CRITICAL_ISSUES;
                        state.jobs.criticalIssues.push(Object.assign({}, envelope.payload, {
                            expanded: true,
                            unread,
                        }));
                        break;
                    case ENVELOPE_TYPES.RefreshRequiredDTO:
                        switch (envelope.payload.type) {
                            case REFRESH_TYPES.ON_CALL: {
                                if (state.auth.agentInfo.role === ROLES.AGENT) {
                                    // actions.tasks.fetchTasks();
                                } else {
                                    actions.jobs.fetchJobs();
                                    actions.jobs.fetchCriticalIssues();
                                }
                            }
                        }
                }
            }
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if (notif.local_notification) {
                //this is a local notification
            }
            if (notif.opened_from_tray) {
                //app is open/resumed because user clicked banner
            }
        });
        FCM.on('refreshToken', (token) => {
            state.auth.fcmToken = token;
            // fcm token may not be available on first load, catch it here
        });
    } catch (e) {
        log('No FCM support');
    }
}