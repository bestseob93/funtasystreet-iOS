import { Actions } from 'react-native-router-flux';
import * as helper from '../helpers/musicstreet.helper';

export const PLAY_SELECTED_MUSIC = "PLAY_SELECTED_MUSIC";
export const REGISTER_STREET = "REGISTER_STREET";
export const ADD_MUSIC_TO_STREET = "ADD_MUSIC_TO_STREET";
export const GET_USER_STREETS = "GET_USER_STREETS";
export const GET_WHOLE_STREETS = "GET_WHOLE_STREETS";
export const SET_PLAY_LIST = "SET_PLAY_LIST";

const fetchSelectMusic = (selectedMusic) => {
  if(selectedMusic) {
    Actions.REFRESH;
    return selectedMusic;
  } else {
    return new Error('music does not selected');
  }
};

export const playSelectedMusic = (selectedMusic) => ({
  type: PLAY_SELECTED_MUSIC,
  payload: fetchSelectMusic(selectedMusic)
});

export const requestRegisterStreet = (street_name, street_radius, range_color, coordinate, address, music) => ({
  type: REGISTER_STREET,
  payload: {
    promise: helper.registerStreet(street_name, street_radius, range_color, coordinate, address, music)
  }
});

export const requestAddMusicToStreet = (id, music) => ({
  type: ADD_MUSIC_TO_STREET,
  payload: {
    promise: helper.addMusicToStreet(id, music)
  }
});

export const requestGetUserStreets = () => ({
  type: GET_USER_STREETS,
  payload: {
    promise: helper.getUserStreets()
  }
});

export const requestGetWholeStreets = () => ({
  type: GET_WHOLE_STREETS,
  payload: {
    promise: helper.getWholeStreets()
  }
});

export const requestSetPlayList = (musiclist) => ({
  type: SET_PLAY_LIST,
  payload: {
    promise: helper.setPlayList(musiclist)
  }
});

const requests = {
  fetching: false,
  fetched: false,
  error: null
};

const initialState = {
  nowPlayList: [],
  myStreets: [],
  wholeStreets: [],
  selectedMusic: {
    artwork_url: "",
    likes_count: 0,
    playback_count: 0,
    stream_url: "",
    title: ""
  },
  registerRequest: { ...requests },
  request: {
    myStreets: { ...requests },
    wholeStreets: { ...requests },
    addMusicStreets: { ...requests }
  }
};

const pending = {fetching: true, fetched: false, error: null};
const fulfilled = {fetching: false, fetched: true, error: null};
const rejected = {fetching: false, fetched: false};

export default function reducer(state=initialState, action) {
  const payload = action.payload;
  console.log(payload);
  switch(action.type) {
    case `${PLAY_SELECTED_MUSIC}`:
      return {
        ...state,
        selectedMusic: payload,
        request: { ...fulfilled }
      };
    case `${PLAY_SELECTED_MUSIC}_REJECTED`:
      return {
        ...state,
        request: { ...rejected, error: payload }
      };
    case `${REGISTER_STREET}_PENDING`:
      return {
        ...state,
        registerRequest: { ...pending }
      };
    case `${REGISTER_STREET}_FULFILLED`:
      return {
        ...state,
        registerRequest: { ...fulfilled }
      };
    case `${REGISTER_STREET}_REJECTED`:
      return {
        ...state,
        registerRequest : { ...rejected }
      };
    case `${GET_USER_STREETS}_PENDING`:
      return {
        ...state,
        request: {
          myStreets: { ...pending }
        }
      };
    case `${GET_USER_STREETS}_FULFILLED`:
      return {
        ...state,
        myStreets: action.payload.data.musicstreets,
        request: {
          myStreets: {...fulfilled}
        }
      };
    case `${GET_USER_STREETS}_REJECTED`:
      return {
        ...state,
        request: {
          myStreets: {...rejected}
        }
      };
    case `${GET_WHOLE_STREETS}_PENDING`:
      return {
        ...state,
        request: {
          wholeStreets: { ...pending }
        }
      };
    case `${GET_WHOLE_STREETS}_FULFILLED`:
      return {
        ...state,
        wholeStreets: action.payload.data.musicstreets,
        request: {
          wholeStreets: { ...fulfilled }
        }
      };
    case `${GET_WHOLE_STREETS}_REJECTED`:
      return {
        ...state,
        request: {
          wholeStreets: { ...rejected }
        }
      };
    case `${ADD_MUSIC_TO_STREET}_PENDING`:
      return {
        ...state,
        request: {
          ...state,
          addMusicStreets: { ...pending }
        }
      };
    case `${ADD_MUSIC_TO_STREET}_FULFILLED`:
      return {
        ...state,
        request: {
          addMusicStreets: { ...fulfilled }
        }
      };
    case `${ADD_MUSIC_TO_STREET}_REJECTED`:
      return {
        ...state,
        request: {
          addMusicStreets: { ...rejected }
        }
      };
    case `${SET_PLAY_LIST}_PENDING`:
      return {
        ...state
      };
    case `${SET_PLAY_LIST}_FULFILLED`:
      return {
        ...state,
        nowPlayList: payload
      };
    case `${SET_PLAY_LIST}_REJECTED`:
      return {
        ...state
      }
    default:
      return state;
  }
}