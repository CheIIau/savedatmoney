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
  }: AugmentedActionContext): Promise<AuthResponse | undefined | void>;
}

const actions: ActionTree<SharedStateInterface, StateInterface> & Actions = {
  async [SharedActions.getUserAuthentification]({
    commit,
  }): Promise<AuthResponse | undefined | void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Токен не найден');
    }
    try {
      const response = await fetch('http://localhost:3000/auth/auth', {
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
