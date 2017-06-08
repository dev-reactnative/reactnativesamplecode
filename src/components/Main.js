/**
 * Created by ori on 05/01/17.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    I18nManager,
    Vibration,
    View,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import {observer, inject} from 'mobx-react/native';
import backAndroidConfig from '../config/backAndroid';
import pushNotificationConfig from '../config/pushNotification';
import localeConfig from '../config/locale';
import MenuContent from './MenuContent';
import Menu from './Menu';
import Drawer from 'react-native-drawer';
import Store from 'rn-json-store';
import noop from 'lodash.noop';
import ExitConfirmation from './ExitConfirmation';
import MainLoadingSpinner from './MainLoadingSpinner';
import TaskCancelModal from './TaskCancelModal';
// import RNFlash from 'react-native-flash';


@inject('state', 'actions') @observer
export default class Main extends Component {
    async componentDidMount() {
        // setTimeout(() => {
        //     RNFlash.hasFlash(() => this.props.actions.main.startFlash(), () => alert("You do not have flash"));
        // }, 5000);
        backAndroidConfig(this.props);
        localeConfig(this.props);
        const port = await Store.get('port');
        if (port) {
            this.props.state.ui.menu.port = this.props.state.api.baseUrl.port = port;
        }
        const host = await Store.get('host');
        if (host) {
            this.props.state.api.baseUrl.host = host;
        }
        pushNotificationConfig(this.props);
        this.props.actions.auth.fetchAgentInfo()
            .then(() => this.props.actions.swiper.goToHomeScreenWhenIdle())
            .catch(noop);
    }

    render() {
        const drawerStyles = {
            drawer: {shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 3, elevation: 5},
            main: {paddingLeft: 3,},
        };
        return (
            <View style={{flex: 1}}>
                <Drawer
                    content={<Menu/>}
                    disabled={!this.props.actions.auth.isSigned()}
                    open={this.props.state.ui.menu.open}
                    onOpen={() => this.props.state.ui.menu.open = true}
                    onClose={() => this.props.state.ui.menu.open = false}

                    tapToClose={true}
                    openDrawerOffset={0.2} // 20% gap on the right side of drawer
                    //panCloseMask={0.2}
                    panOpenMask={0}
                    closedDrawerOffset={-3}
                    captureGestures={false}
                    acceptPan={true}
                    tweenDuration={150}
                    styles={drawerStyles}
                    tweenHandler={(ratio) => ({
                        main: {opacity: (2 - ratio) / 2}
                    })}
                >
                    <MenuContent/>
                </Drawer>
                {this.getFlash()}
                <ExitConfirmation/>
                <MainLoadingSpinner/>
                <TaskCancelModal/>
            </View>
        );
    }

    getFlash() {
        if (this.props.state.main.flashColor) {
            return (
                <View style={{
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 100,
                    alignItems: 'center',
                    position: 'absolute',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: this.props.state.main.flashColor,
                }}>
                </View>
            );
        }
    }
}