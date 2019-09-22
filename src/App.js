import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';

import BetterBanner from 'react-native-better-banner';

const App = () => {
    return (
        <View style={styles.container}>
            <BetterBanner
                bannerComponents={[
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1997fc',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontSize: 35, color: '#fff', marginBottom: 10}}>Page 01</Text>
                        <Text style={{fontSize: 15, color: '#fff'}}>Welcome! have a good time</Text>
                    </View>,
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#da578f',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontSize: 35, color: '#fff', marginBottom: 10}}>Page 02</Text>
                        <Text style={{fontSize: 15, color: '#fff'}}>Welcome! have a good time</Text>
                    </View>,
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#7c3fe4',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{fontSize: 35, color: '#fff', marginBottom: 10}}>Page 03</Text>
                        <Text style={{fontSize: 15, color: '#fff'}}>Welcome! have a good time</Text>
                    </View>,
                ]}
                // bannerImages={[
                //     {uri: "http://attachments.gfan.net.cn/forum/attachments2/201402/05/211339r5eizavo2g5efuar.jpg.thumb.jpg"},
                //     {uri: "http://attachments.gfan.net.cn/forum/attachments2/201402/05/211342pkd8axiibj5axizi.jpg.thumb.jpg"},
                //     {uri: "http://attachments.gfan.net.cn/forum/attachments2/201402/05/2113441e4dw5zvv49jkdow.jpg.thumb.jpg"},
                // ]}
                bannerTitles={["Page 01 Page 01 Page 01 Page 01 Page 01 Page 01 Page 01 ", "Page 02", "Page 03"]}
                indicatorContainerBackgroundColor={'rgba(0,0,0,0.3)'}
                onPress={(index) => alert('you pressed index is : ' + index)}
                isSeamlessScroll={true}
                indicatorGroupPosition={'center'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
   container: {
       flex: 1
   }

});

export default App;
