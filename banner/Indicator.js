/****
 * 指示器
 * ****/
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TextInput,
    TouchableOpacity
} from 'react-native';

const mWidth = require('Dimensions').get('window').width;
const mHeight = require('Dimensions').get('window').height;

export default class ReportPage extends Component {

    componentWillMount() {

        this.initActivePointPosition();
    }

    constructor(props) {
        super();
        this.state = {

        };
    };

    static defaultProps = {
        pointCount: 6,
        activePointColor: '#f00',
        bottomPointsColor: '#aaa',
    };

    initActivePointPosition() {
        // this.leftX = (mWidth - (this.props.pointCount * 6 + (2 * this.props.pointCount - 2) * 6)) / 2 - 6;
        this.rightX = this.props.pointCount * 6 + (2 * this.props.pointCount - 1) * 4 - 6
    }
    renderActivePoint() {
        return (<View
            style={[
                styles.pointStyle,
                styles.activePoint,
                {right: this.rightX,backgroundColor: this.props.activePointColor}
                ]}
            ref={(ref)=> {
                this.indecator = ref
            }}
        />);
    }

    renderBottomPoints() {
        let points = [];
        for (let i = 0; i < this.props.pointCount; i++) {
            points.push(<View key={i} style={[styles.pointStyle, {backgroundColor: this.props.bottomPointsColor}]}/>)
        }
        return (points);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderBottomPoints()}
                {this.renderActivePoint()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: mWidth,
        height: 12,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.3)',
        bottom: 0
    },
    pointStyle: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 4,
        marginRight: 4
    },
    activePoint: {
        position: 'absolute',
        bottom: 3
    }
});

module.exports = ReportPage;
