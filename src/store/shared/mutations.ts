import { MutationTree } from 'vuex';
import { SharedStateInterface } from './state';

export enum SharedMutations {
  setUserAuthFlag = 'setUserAuthFlag',
  setLoadingFlag = 'setLoadingFlag',
}

export type Mutations<S = SharedStateInterface> = {
  [SharedMutations.setUserAuthFlag](state: S, payload: boolean): void;
  [SharedMutations.setLoadingFlag](state: S, payload: boolean): void;
};

const mutation: MutationTree<SharedStateInterface> & Mutations = {
  [SharedMutations.setUserAuthFlag](state, payload: boolean): void {
    state.isAuth = payload;
  },
  [SharedMutations.setLoadingFlag](state, payload: boolean): void {
    state.isLoading = payload;
  },
};

export default mutation;
