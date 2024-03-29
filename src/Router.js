import React from 'react';
import { Scene, Router, Actions, ActionConst, Modal } from 'react-native-router-flux';

import { First, CustomTabBar, TabView, PlayList, MusicStreet, Login, Register } from './components';
import { TabIcon, MyMusicMapIcon } from './components/common';

const RouterComponent = () => {
  return (
    <Router>
        <Scene key="root" hideNavBar>
          <Scene key="first" initial={true} component={First} title="First Home"/>
            <Scene key="tabmain" tabs component={CustomTabBar} type={ActionConst.REFRESH} tabBarStyle={{backgroundColor: '#fff'}} tabBarSelectedItem={{backgroundColor: '#ddd'}}>
              <Scene key="home" initial sceneName="home" hideNavBar component={TabView} title="Funtasy Street" navigationBarStyle={{backgroundColor:'white'}} icon={TabIcon}/>
              <Scene key="search" sceneName="search" hideNavBar component={TabView} title="Search" navigationBarStyle={{backgroundColor:'white', borderBottomColor: 'transparent'}} icon={TabIcon}/>
              <Scene key="mymusicmap" sceneName="mymusicmap" component={TabView} title="MyMusicMap" hideNavBar icon={TabIcon}/>
              <Scene key="map" sceneName="navigate" hideNavBar component={TabView} title="MyStreetView" navigationBarStyle={{backgroundColor: 'white'}} icon={TabIcon}/>
              <Scene key="mypage" sceneName="person" hideNavBar title="MyPage" navigationBarStyle={{backgroundColor:'white'}} icon={TabIcon}>
                <Scene key="mypagemain" hideNavBar component={TabView} title="MyPage" />
                <Scene key="mymusicstreet" hideNavBar component={MusicStreet} title="MyMusicStreet"/>
                <Scene key="playlist" hideNavBar sceneName="playlisst" component={PlayList} title="PlayList"/>
              </Scene>
              <Scene key="mymusicstreetmain" hideNavBar component={MusicStreet} title="MyMusicStreet"/>
            </Scene>
          <Scene key="login" direction="vertical" component={Login} title="로그인"/>
          <Scene key="register" component={Register} title="회원가입"/>
        </Scene>
    </Router>
  );
};

export default RouterComponent;
