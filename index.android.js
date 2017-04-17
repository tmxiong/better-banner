/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';


import Banner from './banner/Banner'


import banner1 from './banner/image/banner1.jpg';
import banner2 from './banner/image/banner2.jpg';
import banner3 from './banner/image/banner3.jpg';
import banner4 from './banner/image/banner4.jpg';

export default class testAnimate extends Component {
  render() {
    return (
      <View style={styles.container}>
       <Banner
           bannerList={[banner1,banner2,banner3,banner4]}
       />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('testAnimate', () => testAnimate);
