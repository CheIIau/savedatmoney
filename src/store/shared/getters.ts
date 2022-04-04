import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { SharedStateInterface } from './state';

export enum SharedGetters {
  isUserAuth = 'isUserAuth',
  isLoading = 'isLoading',
}

export type Getters = {
  [SharedGetters.isUserAuth](state: SharedStateInterface): boolean;
  [SharedGetters.isLoading](state: SharedStateInterface): boolean;
};

const getters: GetterTree<SharedStateInterface, StateInterface> & Getters = {
  [SharedGetters.isUserAuth](state) {
    return state.isAuth;
  },
  [SharedGetters.isLoading](state) {
    return state.isLoading;
  },
};

export default getters;
