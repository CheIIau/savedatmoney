import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { SharedStateInterface } from './state';
import { Mutations, SharedMutations } from './mutations';

export enum SharedActions {
  getUserAuthentification = 'getUserAuthentification',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<SharedStateInterface, StateInterface>, 'commit'>;

export interface Actions {
  [SharedActions.getUserAuthentification]({
    commit,
  }: AugmentedActionContext): Promise<AuthResponse | undefined>;
}

const actions: ActionTree<SharedStateInterface, StateInterface> & Actions = {
  async [SharedActions.getUserAuthentification]({
    commit,
  }): Promise<AuthResponse | undefined> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Токен не найден');
      return;
    }
    try {
      const response = await fetch('/auth/auth', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const resJson = (await response.json()) as AuthResponse;
      const message = resJson.message;
      if (response.status === 400 || !resJson.token) {
        throw new Error(message);
      }
      if (resJson !== undefined && resJson.token) {
        commit(SharedMutations.setUserAuthFlag, true);
      }
    } catch (error) {
      const message = (error as Error).message;
      console.log(message);
    }
  },
};

export interface AuthResponse extends Response {
  message: string;
  token?: string;
  userId?: string;
}

export default actions;

// const actions: ActionTree<SharedStateInterface, StateInterface> & Actions = {
//   [SharedActions.setUserAuthFlag]({ commit }, payload): Promise<void> {
//     return new Promise((resolve) => {
//       commit(SharedMutations.setUserAuthFlag, payload);
//       resolve();
//     });
//   },
// };
