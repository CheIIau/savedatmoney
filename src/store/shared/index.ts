import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { SharedStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const exampleModule: Module<SharedStateInterface, StateInterface> = {
  namespaced: false,
  actions,
  getters,
  mutations,
  state,
};

export default exampleModule;
