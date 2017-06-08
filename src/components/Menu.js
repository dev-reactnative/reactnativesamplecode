/**
 * Created by ori on 05/01/17.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    I18nManager,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TextInput,
    Alert
} from 'react-native';
import {observer, inject} from 'mobx-react/native';
import {
    MKButton,
} from 'react-native-material-kit';
import I18n from '../lib/i18n';
import {CHECK_IN_STATUSES, SHIFT_ROLES} from '../constants';
import {Select, Option} from 'react-native-chooser';
import Accordion from 'react-native-accordion';
// import VersionNumber from 'react-native-version-number';



@inject('state', 'actions') @observer
export default class Menu extends Component {
    
    getSettingsSubmenu() {
        return (
            <View style={styles.submenuOuterContainer}>
                <View style={styles.submenuSpacer}></View>
                <View style={styles.submenuContainer}>
                
                    {this.getLanguageSelector()}
                    <View style={styles.portContainer}>
                        <TextInput
                            value={this.props.state.ui.menu.port}
                            onChangeText={(text) => this.props.state.ui.menu.port = text}
                            placeholder="Port"
                            placeholderTextColor={'#fff'}
                            style={styles.portInput}
                            underlineColorAndroid={'transparent'}
                        />
                        {/*<PortButton onPress={() => {
                                this.props.state.ui.menu.open = false;
                                this.props.actions.api.changePort();
                            }}/>*/}
                        <TouchableWithoutFeedback onPress={() => {
                                    this.props.state.ui.menu.open = false;
                                    this.props.actions.api.changePort(); }}>
                            <View style={{
                                    width: 48,
                                    alignSelf: 'center',   
                                    backgroundColor: '#9e9e9e',
                                    justifyContent: 'center',}}>          
                                <Text style={{
                                        height: 36,
                                        color: '#fff',
                                        lineHeight: 26,
                                        fontWeight: 'bold',
                                        textAlign: 'center',}}>
                                    Go
                                </Text>  
                            </View>
                        </TouchableWithoutFeedback>
                        

                    </View>
                </View>
            </View>
        );
    }

    getMoreSubmenu() {
        return (
            <View style={styles.submenuOuterContainer}>
                <View style={styles.submenuSpacer}></View>
                <View style={styles.submenuContainer}>
                    <Button
                    state={this.props.state}
                    onPress={() => this.props.actions.auth.signout()}
                    imgSrc={require('../img/signed_out.png')}
                    text="signout"
                    />
                </View>
            </View>
        );
    }



    render() {

        const menuHeaderText = 'Hotel California';

        const settingsButton = (    
            <View style={styles.menuButtonRow}>
                {/*<Image style={styles.menuIcon}
                                       source={require('../img/signed_out.png')}
                                />*/}
                <Text style={styles.menuText}>{I18n.t('settings')}</Text>
            </View>
        );
        
        const moreButton = (
            <View style={styles.menuButtonRow}>
                {/*<Image style={styles.menuIcon}
                                       source={require('../img/signed_out.png')}
                                />*/}
                <Text style={styles.menuText}>{I18n.t('more')}</Text>
            </View>            
        );

        const checkoutButtonEnabled = this.props.actions.auth.isSigned() &&
            this.props.state.auth.agentInfo.roleRequiresCheckin &&
            (this.props.state.auth.checkinStatus.status === CHECK_IN_STATUSES.CHECKED_IN || this.props.state.auth.checkinStatus.shiftRole === SHIFT_ROLES.PENDING);



        return (

                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={() => this.props.state.ui.menu.open = false}>
                        <View style={{justifyContent: 'flex-start', flexDirection: 'row', padding: 5}}>
                            <Text style={[styles.menuText, {fontSize: 18}]}>x</Text>
                        </View>

                    </TouchableWithoutFeedback>
                    <View style={styles.buttonsOuterContainer}>
                        <View style={styles.buttonsInnerContainerSpacer}></View>
                        <View style={styles.buttonsInnerContainer}>
                            
                            
                            <View style={styles.menuButtonRow}>
                                <Text style={styles.menuHeaderText}>
                                    {menuHeaderText}
                                </Text> 
                            </View>
                            <Button
                                disabled={!checkoutButtonEnabled}
                                state={this.props.state}
                                imgSrc={require('../img/power_icon.png')}
                                text="checkout"
                                onPress={() => this.props.actions.auth.checkOut()}
                            />
                            <Button
                                state={this.props.state}
                                onPress={() => this.props.actions.history.openHistoryScreen()}
                                imgSrc={require('../img/signed_out.png')}
                                text="showHistory"
                            />
                            <Accordion
                                header={settingsButton}
                                content={this.getSettingsSubmenu()}
                                easing="easeOutCubic"
                            />
                            <Accordion
                                header={moreButton}
                                content={this.getMoreSubmenu()}
                                easing="easeOutCubic"
                            />
                        </View>
                    </View>


                    <View style={styles.buildContainer}>
                        <Text style={styles.buildText}>
                            Build 50
                        </Text>
                    </View>
                </View>

        );
    }

    getLanguageSelector() {
        if (this.props.state.main.locale) {
            const languageOptions = this.props.state.auth.locales.map(
                (locale, i) => <Option key={i}
                                       styleText={styles.languageOptionText}
                                       value={locale}>
                    {locale.displayName}
                </Option>
            );
            return (
                <View style={styles.languageSelectRow}>
                    <Text style={styles.languageSelectLabel}>
                        {I18n.t('chooseLanguage')}:
                    </Text>
                    <Select
                        transparent={true}
                        onSelect={this.onLocaleSelect}
                        defaultText={this.props.state.main.locale.displayName}
                        style={styles.languageSelect}
                        textStyle={styles.languageSelectText}
                        backdropStyle={styles.languageSelectBackdrop}
                        optionListStyle={styles.languageSelectoptionList}
                        selectedStyle={{}}
                    >
                        {languageOptions}
                    </Select>
                </View>
            );
        }
    }

    onLocaleSelect = locale => {
        if (this.props.state.main.locale !== locale) {
            Alert.alert(
                I18n.t('changingLanguage'),
                I18n.t('changeLanguageConfirmationMessage'),
                [
                    {text: I18n.t('cancel')},
                    {
                        text: I18n.t('changeLanguage'),
                        onPress: () => this.props.actions.main.changeAgentLanguage(locale)

                    },
                ],
                {cancelable: true}
            );
        }
    }
}

const Button = props => {
    const menuTextStyle = props.disabled ? [styles.menuText, styles.menuTextDisabled] : styles.menuText;
    return (
        <TouchableHighlight
            onPress={() => {
                if (!props.disabled) {
                    props.state.ui.menu.open = false;
                    if (props.onPress) {
                        return props.onPress();
                    }
                }
            }}
        >
            <View style={styles.menuButtonRow}>
                {/*<Image style={styles.menuIcon}
                                       source={props.imgSrc}
                                />*/}
                <Text style={menuTextStyle}>{I18n.t(props.text)}</Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#24263e',

        // backgroundColor: '#000'
    },
    buttonsOuterContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    buttonsInnerContainerSpacer: {
        flex: 1,
    },
    buttonsInnerContainer: {
        flex: 7,
    },
    menuButtonRow: {
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#666',
        justifyContent: 'flex-start',
    },
    menuHeaderText: {
        color: '#496cf3',
        fontSize: 24,
        marginVertical: 12,
    },
    button: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
    },
    menuIcon: {
        width: 28,
        height: 28,
        marginRight: 20,
        tintColor: "#757575",
    },
    menuText: {
        height: 30,
        fontSize: 18,
        color: '#fff',
        lineHeight: 25,
        fontWeight: '400',
        fontFamily: "Roboto",
    },
    menuTextDisabled: {
        color: '#999',
    },
    submenuOuterContainer: {
        
        flexDirection: 'row',
    },
    submenuSpacer: {
        flex: 1,
    },
    submenuContainer: {
        flex: 7,
        // marginHorizontal: 50,
    },

    portContainer: {
        width: 160,
        flexDirection: 'row',
    },
    portInput: {
        flex: 1,
        color: '#fff',
        paddingHorizontal: 0,
        textAlign: 'center',
    },
    languageSelectRow: {
        flexDirection: 'row',
        // paddingHorizontal: 20,
        borderColor: 'transparent',
        justifyContent: 'flex-start',
    },
    languageSelectLabel: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 32,
        fontWeight: '400',
        fontFamily: "Roboto",
    },
    languageSelect: {
        width: 120,
        borderColor: 'transparent',
    },
    languageSelectText: {
        color: '#fff',
        fontSize: 16,
    },
    languageSelectBackdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    languageSelectoptionList: {
        backgroundColor: "#F5FCFF",
        width: 120,
        height: 108,
    },
    languageOptionText: {
        fontSize: 16,
    },
    languageOptionTextSelected: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    buildContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        margin: 10
    },
    buildText: {
        color: '#fff'
    }

});