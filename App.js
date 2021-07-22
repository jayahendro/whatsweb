/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  Dimensions,
  Platform,
  BackHandler,
  PermissionsAndroid,
  ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';
import Toast, { DURATION } from 'react-native-easy-toast';

import AppStatusBar from './components/AppStatusBar';

const THEME_COLOR = '#000';

export default class App extends Component {
  constructor(state, props) {
    super(state, props);
    this.state = {
      width: null,
      height: null,
      closeWindow: false
    };
  }

  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted")
      } else {
        console.log("Permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton.bind(this));

    // this.requestPermission();
  }

  componentWillUnmount() {
    if (Toast.toastInstance != null && Toast.toastInstance.root != null) { Toast.hide(); }

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton.bind(this));
  }

  handleBackButton = () => {
    const { props, state, toast } = this;
    if (state.closeWindow) {
      return false;
    } else {
      toast.show('Tekan lagi untuk keluar', 2000);
    }
    this.setState({closeWindow: true});

    setTimeout(() => {
      this.setState({ closeWindow: false});
    }, 3000);
    return true;
  }

  onLayout = (event) => {
    const { width, height } = Dimensions.get('screen');
    this.setState({ width, height });
  }

  render() {
    const { width, height, status } = this.state;
    const styles = getLocalStyles(width, height);
    const scalePage = Platform.OS === 'android';
    const INJECTED = `
      try{
        const meta = document.createElement('meta');

        window.isNativeApp = true;
        meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0');
        meta.setAttribute('name', 'viewport');
        document.getElementsByTagName('head')[0].appendChild(meta);
      } catch(e) {
        window.ReactNativeWebView.postMessage(
            JSON.stringify({
                injected: false,
            }),
        )
      }
      true;
    `
    return (
      <>
        <SafeAreaView
          style={styles.bottomSafeArea}
          onLayout={this.onLayout}>
          <AppStatusBar
            backgroundColor={THEME_COLOR}
            barStyle="light-content"
          />
          <WebView
            userAgent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            automaticallyAdjustContentInsets={false}
            scalesPageToFit={scalePage}
            source={{ uri: 'https://web.whatsapp.com/' }}
            javaScriptEnabled={true}
            injectedJavaScript={INJECTED}
            bounces={false}
            scrollEnabled={true}
            originWhitelist={['*']}
            useWebKit={true}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                color='blue'
                size='large'
                style={{
                  flex: 1
                }}
              />
            )}
          />
          
          <Toast ref={(toast) => {
            if (!this.state.closeWindow) {
              this.toast = toast;
            }
          }} />
        </SafeAreaView>
      </>
    );
  }
};

const getLocalStyles = (width, height) => {
  return {
    topSafeArea: {
      flex: 0,
      backgroundColor: THEME_COLOR
    },
    bottomSafeArea: {
      flex: 1,
      width: width,
      height: height,
      backgroundColor: THEME_COLOR
    }
  }
};