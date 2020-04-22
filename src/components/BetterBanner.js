/*****
 * 轮播图 组件
 * ****/

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    Platform,
    TouchableOpacity
} from 'react-native';

const {width} = Dimensions.get('window');

export default class BetterBanner extends PureComponent {

    static defaultProps = {
        bannerImages: [],
        bannerComponents: [],
        bannerHeight: 250,
        bannerTitles: [],
        bannerTitleTextColor: "#fff",
        bannerTitleTextSize: 14,
        scrollInterval: 2000,
        isAutoScroll: true,
        isSeamlessScroll: false, // 无缝滚动
        adaptSeamlessScrollValue: false, // 无缝滚动显示异常时修改此值
        indicatorWidth: 10,
        indicatorHeight: 6,
        indicatorColor: 'rgba(255,255,255,0.6)',
        indicatorStyle: {},
        indicatorGap: 6, // 2个指示器之间的间隙
        activeIndicatorColor: '#fff',
        indicatorGroupPosition: "right", // left, center, right
        indicatorGroupSideOffset: 10, // 左右边距
        indicatorContainerHeight: 32,
        indicatorContainerBackgroundColor: 'transparent',

        onPress: () => {
        },
        onScrollEnd: () => {
        },

    };

    constructor(props) {
        super(props);
        const {indicatorWidth, indicatorHeight, indicatorGap, indicatorStyle} = props;

        // 不允许外部设置margin 与 padding
        indicatorStyle.marginLeft = 0;
        indicatorStyle.marginBottom = 0;
        indicatorStyle.marginTop = 0;
        indicatorStyle.marginRight = 0;
        indicatorStyle.paddingLeft = 0;
        indicatorStyle.paddingBottom = 0;
        indicatorStyle.paddingTop = 0;
        indicatorStyle.paddingRight = 0;

        this.state = {};
        this.currentBannerData = [];
        this.offsetX = 0;
        this.nextPage = 1;
        this.isAutoScroll = props.isAutoScroll;
        // 活动指示器初始值
        this.initActiveIndicatorX = null;
        // 每翻一页，指示器滚动的距离
        this.activeIndicatorX = props.indicatorWidth + props.indicatorGap;

        this.bannerView = this.getBannerView();
        this.isInitScroll = true;

        this.indicatorStyle = {
            ...indicatorStyle,
            width: indicatorWidth,
            height: indicatorHeight,
            borderRadius: indicatorHeight,
            marginLeft: indicatorGap / 2,
            marginRight: indicatorGap / 2,

        }
    };

    componentDidMount() {
        this.isInitScroll = true;
        setTimeout(() => this.initScroll(), 0);
        this.startAutoScroll();
    }

    componentWillUnmount() {
        this.scrollTimer && clearInterval(this.scrollTimer);
        this.animTimer && clearTimeout(this.animTimer);
    }

    initScroll() {
        if (!this.props.isSeamlessScroll || this.currentBannerData.length < 2) {
            return;
        }
        if (this.isInitScroll) {
            this.scrollTo(width, false);
            this.setBannerTitleText(32)
        } else if (this.isPageScrollEnd()) {
            this.initNextPage();
            let showAnim = this.props.adaptSeamlessScrollValue;
            // let showAnim = Platform.OS === 'android'; // 兼容问题
            this.scrollTo(width * this.nextPage, showAnim);
            this.setActiveIndicatorX(this.activeIndicatorX * this.nextPage);
            this.setBannerTitleText(32 * this.nextPage)
        }
    }

    isPageScrollEnd() {
        return this.props.isSeamlessScroll && (this.nextPage === 0 || this.nextPage === this.bannerView.length - 1);
    }

    isIndicatorScrollEnd() {
        return this.props.isSeamlessScroll && (this.nextPagePixel < 1 || this.nextPagePixel > this.bannerView.length - 2);
    }

    initNextPage() {
        this.nextPage = this.nextPage === 0 ? this.bannerView.length - 2 : 1;
    }

    scrollTo(x, showAnim = true) {
        this.scrollView.scrollTo({x: x, animated: showAnim});
    }

    getBannerView() {
        const {bannerImages, bannerComponents, isSeamlessScroll} = this.props;
        let _bannerView = [];
        let _bannerList = [];
        let isSwitchBannerImages = true;

        if (bannerImages && bannerImages.length > 0) {
            _bannerList = JSON.parse(JSON.stringify(bannerImages));
            this.currentBannerData = bannerImages;
        } else if (bannerComponents && bannerComponents.length > 0) {
            _bannerList = bannerComponents.map((item, index) => {
                return React.cloneElement(item);
            });
            this.currentBannerData = bannerComponents;
            isSwitchBannerImages = false;
        } else {
            return null;
        }

        if (isSeamlessScroll && this.currentBannerData.length > 1) {
            _bannerList.unshift(_bannerList[_bannerList.length - 1]);
            _bannerList.push(_bannerList[1]);
        }

        for (let i = 0; i < _bannerList.length; i++) {
            _bannerView.push(
                <TouchableOpacity
                    style={styles.bannerContent}
                    key={i}
                    activeOpacity={1}
                    onPress={() => this.props.onPress(isSeamlessScroll ? i - 1 : i)}>
                    {
                        isSwitchBannerImages
                            ?
                            <Image style={[styles.imageStyle, {height: this.props.bannerHeight}]}
                                   source={_bannerList[i]}/>
                            :
                            _bannerList[i]
                    }
                </TouchableOpacity>
            );
        }


        return _bannerView;
    }

    setActiveIndicatorX(x) {
        x = this.props.isSeamlessScroll ? (x - this.activeIndicatorX) : x;
        x = Platform.OS === 'ios' ? x - this.props.indicatorGap / 2 : x;
        this.activeIndicator.setNativeProps({style: {left: x}})
    }

    setBannerTitleText(y) {
        if(this.props.bannerTitles.length === 0) return;
        this.bannerTitleContent.setNativeProps({style: {marginTop: -y}})
    }

    onScroll(event) {
        if (this.isInitScroll) {
            this.isInitScroll = false;
            return;
        }
        this.offsetX = event.nativeEvent.contentOffset.x;
        this.nextPage = Math.round(this.offsetX / width);
        this.nextPagePixel = this.offsetX / width;


        let indicatorX = 0;
        let bannerContentY = 0;
        //指示器滚动效果--自动滚动
        if (this.isAutoScroll) {
            indicatorX = this.initActiveIndicatorX + this.nextPage * this.activeIndicatorX;
            bannerContentY = this.nextPage * 32
        } else {
            //指示器滚动效果--手动滑动
            indicatorX = this.initActiveIndicatorX + this.nextPagePixel * this.activeIndicatorX;
            bannerContentY = this.nextPagePixel * 32
        }
        this.setBannerTitleText(bannerContentY);
        if (this.isIndicatorScrollEnd()) {
            return;
        }
        this.setActiveIndicatorX(indicatorX);

    }

    onTouchStart() {
        this.isAutoScroll = false;
        this.scrollTimer && clearInterval(this.scrollTimer);
        this.animTimer && clearTimeout(this.animTimer);
    }

    // 没有滑动手势才会调用此方法
    onTouchEnd() {
        // 解决 安卓滑到中间松开手势会停止滚动
        if (Platform.OS === 'android') {
            let offsetx1 = this.offsetX;
            setTimeout(() => {
                if (offsetx1 === this.offsetX) {
                    this.scrollTo(this.nextPage * width);
                }
            }, 100)
        }
        this.startAutoScroll();
    }

    startAutoScroll() {
        if (this.currentBannerData.length < 2) {
            return;
        }
        this.scrollTimer && clearInterval(this.scrollTimer);
        this.animTimer && clearTimeout(this.animTimer);

        this.isAutoScroll = true;
        this.scrollTimer = setInterval(() => {
            // console.warn('nextPage', this.nextPage);
            this.scrollTo(this.nextPage * width);
            this.animTimer = setTimeout(() => {
                this.nextPage++;
                if (this.nextPage >= this.bannerView.length) {
                    if (this.props.isSeamlessScroll) {
                        this.nextPage = 1;
                        this.scrollTo(width * this.nextPage, false);
                        this.setActiveIndicatorX(this.activeIndicatorX * this.nextPage);
                    } else {
                        this.nextPage = 0;
                    }
                }
            }, 500)

        }, this.props.scrollInterval);
    }

    onMomentumScrollEnd(event) {
        // console.warn(event.nativeEvent.contentOffset.x);
        this.startAutoScroll();
        this.initScroll();
        this.props.onScrollEnd(event);
    }


    renderActiveIndicator() {
        return (<View
            style={[
                this.indicatorStyle,
                styles.activePoint,
                {backgroundColor: this.props.activeIndicatorColor}
            ]}
            ref={(ref) => {
                this.activeIndicator = ref
            }}
            // 测算左边距长度
            onLayout={() => this.activeIndicator.measure((x, y, width, height, pageX, pageY) => {
                if (!this.initActiveIndicatorX) {
                    this.initActiveIndicatorX = x;
                }
            })}
        />);
    }

    renderBottomIndicator() {
        let points = [];
        let {length} = this.currentBannerData;
        for (let i = 0; i < length; i++) {
            points.push(<View key={i} style={[this.indicatorStyle, {backgroundColor: this.props.indicatorColor}]}/>)
        }
        return points;
    }

    renderBannerTitle() {
        let {bannerTitles, bannerTitleTextColor, isSeamlessScroll, indicatorGroupSideOffset, indicatorContainerHeight, indicatorWidth, indicatorGap} = this.props;
        let currentBannerTitles = JSON.parse(JSON.stringify(bannerTitles));
        let currentIndicatorWidth = this.indicatorStyle.width || indicatorWidth;
        if (bannerTitles.length > 0) {
            if (isSeamlessScroll) {
                currentBannerTitles.unshift(currentBannerTitles[currentBannerTitles.length - 1]);
                currentBannerTitles.push(currentBannerTitles[1]);
            }
            let bannerTitleView = currentBannerTitles.map((item, index) => {
                return <Text key={index} numberOfLines={1}
                             style={[styles.bannerTitleText,
                                 {lineHeight: indicatorContainerHeight, color: bannerTitleTextColor},
                                 {width: width - indicatorGroupSideOffset * 2 - this.currentBannerData.length * (currentIndicatorWidth + indicatorGap) - 10}]}>{item}</Text>
            });
            return <View ref={ref => this.bannerTitleContent = ref}>{bannerTitleView}</View>
        } else {
            return null;
        }
    }

    getIndicatorGroupPosition() {
        const {indicatorGroupPosition, bannerTitles} = this.props;
        let p_style = {
            alignSelf: 'flex-end',
        };

        if(bannerTitles.length === 0) {
            if (indicatorGroupPosition === "left") {

                p_style.alignSelf = 'flex-start'

            } else if (indicatorGroupPosition === "right") {

                p_style.alignSelf = 'flex-end'

            } else if (indicatorGroupPosition === "center") {

                p_style.alignSelf = 'center'

            } else {
                console.warn("indicatorGroupPosition value error, the value must one of 'left', 'right' or 'center'");
            }
        }


        return p_style;
    }

    render() {
        const {bannerHeight, indicatorGroupSideOffset, indicatorContainerHeight, indicatorContainerBackgroundColor} = this.props
        return (
            this.currentBannerData.length === 0
                ? <View style={[styles.container,styles.noDataContainer, {height: bannerHeight}]}>
                    <Text style={{color: '#fff',fontSize: 24,marginBottom:10}}>There is no banner data</Text>
                    <Text style={{color: '#fff', fontSize: 14}}>Please add</Text>
                    <Text style={{color: '#fff', fontSize: 14}}>bannerComponents or bannerImages</Text>
                </View>
                : <View style={[styles.container, {height: bannerHeight}]}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={70}
                        pagingEnabled={true}
                        onScroll={this.onScroll.bind(this)}
                        onTouchStart={() => this.onTouchStart()}
                        onTouchEnd={() => this.onTouchEnd()}
                        onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)} // 滚动动画结束时调用
                        ref={(ref) => this.scrollView = ref}
                    >
                        {this.bannerView}
                    </ScrollView>
                    <View
                        style={[styles.indicatorContainer, {
                            paddingLeft: indicatorGroupSideOffset,
                            paddingRight: indicatorGroupSideOffset,
                            height: indicatorContainerHeight,
                            backgroundColor: indicatorContainerBackgroundColor,
                        }]}
                    >
                        <View style={[styles.bannerTitleContainer, {
                            marginLeft: indicatorGroupSideOffset,
                            height: indicatorContainerHeight
                        }]}>
                            {this.renderBannerTitle()}
                        </View>

                        <View
                            style={[styles.indicatorContent, this.getIndicatorGroupPosition()]}>
                            {this.renderActiveIndicator()}
                            {this.renderBottomIndicator()}
                        </View>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        width: width,
    },
    noDataContainer: {
        backgroundColor:'#1997fc',
        alignItems:'center',
        justifyContent:'center'
    },
    bannerContent: {
        width: width,
        zIndex: 9999,
    },

    bannerTitleContainer: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0

    },
    bannerTitleText: {
        color: '#aaa',
    },
    imageStyle: {
        width: width,
        height: "100%",
        resizeMode: 'stretch',
    },

    indicatorContainer: {
        position: 'absolute',
        width: width,
        bottom: 0,
        justifyContent: 'center'
    },

    indicatorContent: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    activePoint: {
        position: 'absolute',
    },
});