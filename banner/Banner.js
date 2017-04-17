/*****
 * 首页轮播图
 * ****/

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';


const mWidth = require('Dimensions').get('window').width;
const mHeight = require('Dimensions').get('window').height;

import Indicator from './Indicator';

export default class Banner extends Component {

    componentDidMount() {
        this.startScroll();
    }

    componentWillUnmount() {
        clearInterval(this.scrollTimer);
    }

    constructor(props) {
        super(props);

        this.state = {};
        this.nextPage = 0;
        this.isAutoScroll = true;
    };

    static defaultProps = {
        bannerList: [],
    };

    renderBanner() {
        let arr = [];
        for (let i in this.props.bannerList) {
            arr.push(<Image key={i} style={styles.imageStyle} source={this.props.bannerList[i]}/>);
        }
        return arr;
    }

    onScroll(event) {

        let offsetX = event.nativeEvent.contentOffset.x;
        this.nextPage = Math.round(offsetX / mWidth);
        this.nextPagePixel = offsetX / mWidth;

        //指示器滚动效果--自动滚动
        if(this.isAutoScroll){
            this.ref.indecator.setNativeProps(
                {style: {right: this.ref.rightX - this.nextPage * 14}}
            )
        }else {
            //指示器滚动效果--手动滑动
            this.ref.indecator.setNativeProps(
                {style: {right: this.ref.rightX - this.nextPagePixel * 14}}
            )
        }

    }

    onTouchStart() {
        this.isAutoScroll = false;
        if (this.scrollTimer) {
            clearInterval(this.scrollTimer);
        }
    }

    startScroll() {

        if(this.scrollTimer){
            clearInterval(this.scrollTimer);
        }
        this.isAutoScroll = true;
        this.scrollTimer = setInterval(()=> {
            this.scrollView.scrollTo({x: this.nextPage * mWidth}, true);
            this.nextPage++;
            if (this.nextPage >= this.props.bannerList.length) {
                this.nextPage = 0;
            }
        }, 2000);

    }

    render() {

        return (
            <View style={styles.container}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onScroll={this.onScroll.bind(this)}
                    onTouchStart={()=>this.onTouchStart()}
                    onScrollEndDrag={()=>this.startScroll()}
                    onTouchEnd={()=>this.startScroll()}
                    ref={(ref)=>this.scrollView = ref}

                >
                    {this.renderBanner()}
                </ScrollView>
                <Indicator
                    pointCount={this.props.bannerList.length}
                    ref={(ref)=>this.ref = ref}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: mWidth,
        height: mWidth * 0.5,
    },
    imageStyle: {
        width: mWidth,
        height: mWidth * 0.5,
    },
    indicatorStyle: {}
});

module.exports = Banner;
