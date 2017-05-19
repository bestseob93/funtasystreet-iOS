import React, { Component } from 'react';
import { View, Text, ScrollView, AppState, StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Button, Content, Thumbnail, Card, CardItem, Left, Body, Right, List, ListItem } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';

import Geofence from '../Geofence';
import MarkerTest from '../MyMusicMap/MarkerTest';
import PushController from '../common/PushController';

const { width, height } = Dimensions.get('window');

const mapHeight = height / 2.5;
const contentHeight = height - mapHeight - 100;

class MyStreetMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.582176,
        longitude: 127.0095657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      selectedMarker: []
    };

    this.pushAlarm = this.pushAlarm.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.renderCircles = this.renderCircles.bind(this);
    // this.renderMusics = this.renderMusics.bind(this);
    // this.renderMusicItems = this.renderMusicItems.bind(this);
    this.loadPlayList = this.loadPlayList.bind(this);
  }

  // TODO: 이부분 더 좋은 로직으로 수정필요
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedMarker.length !== this.state.selectedMarker.length;
  }

  componentDidMount() {
    const { myStreets } = this.props;
    AppState.addEventListener('change', this.pushAlarm);
    let concatedArr = [];
    for(let i = 0; i < myStreets.length; i++ ) {
      concatedArr.push(myStreets[i].circleCoords);
    }
    console.log(concatedArr);

    console.log(myStreets);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log(point);
        for(let i = 0; i < concatedArr.length; i++) {
          Geofence.containsLocation(point, concatedArr[i])
            .then(() => console.log(i))
            .catch(() => console.log('no way'))
        }

      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  componentWillUnMount() {
    AppState.removeEventListener('change', this.pushAlarm);
  }

  pushAlarm(appState) {
    console.log('pushed');
    console.log(appState);
    const { myStreets } = this.props;
     if(appState === 'background') {
    PushNotification.localNotificationSchedule({
                  message: `성북동 호랑이 주변입니다. 노래를 들어보세요`,
                  date: new Date(Date.now() + (4 * 1000)) // in 60 secs
                });
     }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  renderMarkers(props) {
    return props.map((data, i) => {
      return (
        <MapView.Marker
          key={(data.coord.latitude + data.coord.longitude).toString()}
          coordinate={{latitude: data.coord.latitude, longitude: data.coord.longitude}}
          onSelect={(e) => console.log('onSelect', e)}
          onDrag={(e) => console.log('onDrag', e)}
          onDragStart={(e) => console.log('onDragStart', e)}
          onDragEnd={(e) => console.log('onDragEnd', e)}
          onPress={(e) => this.setState({selectedMarker: data.music, selectedStreetName: data.street_name})}
          draggable>
          <MarkerTest key={ i } myStreetName={data.street_name}/>
        </MapView.Marker>
      );
    })
  }

  renderCircles(props) {
    console.log(props);
    return props.map((data, i) => {
      console.log(data);
      return (
        <MapView.Circle
          key={ i }
          center={{latitude: data.coord.latitude, longitude: data.coord.longitude}}
          radius={data.street_radius}
          strokeColor='transparent'
          fillColor={data.range_color}/>
      );
    });
  }

  loadPlayList() {
    let musics = this.state.selectedMarker;
    console.log(musics);
    return (
      <ListItem thumbnail>
        <Left>
          <Thumbnail key={musics[0].artist_url} size={20} source={{uri: `${musics[0].artist_url}`}} />
        </Left>
          <Body><Text key={musics[0].track}>{musics[0].track}</Text></Body>
      </ListItem>
    )
  }

  render() {
    const { onRegionChange, renderMarkers, renderCircles, loadPlayList } = this;
    const { myStreets } = this.props;

    console.log(this.state);
    return (
      <Container>
        <PushController/>
        <Content>
            <MapView provider={PROVIDER_GOOGLE}
                     style={styles.map}
                     initialRegion={this.state.region}
                     region={this.state.region}
                     onRegionChange={onRegionChange}>
                     {renderMarkers(myStreets)}
                     {renderCircles(myStreets)}
            </MapView>
            <View style={styles.scrollViewContainer}>
              <List>
                <ListItem itemDivider first>
                  <Text>거리 제목</Text>
                </ListItem>
                <ListItem style={{borderBottomWidth: 0}}>
                <Text>{this.state.selectedStreetName}</Text>
                </ListItem>
                <ListItem itemDivider>
                  <Text>최근 방문</Text>
                </ListItem>
                <ListItem style={{borderBottomWidth: 0}}>
                  <Text>2017-05-20</Text>
                </ListItem>
              { /* 최근 방문 리스트 아이템 출력 */ }
              <ListItem itemDivider>
                <Text>음악 목록</Text>
              </ListItem>
                {this.state.selectedMarker.length > 0 ? loadPlayList() : null}
              </List>
          </View>
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: mapHeight,
    zIndex: -1
  },
  scrollViewContainer: {
    padding: 20
  }
});

export default MyStreetMap;
