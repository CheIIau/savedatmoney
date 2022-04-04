export interface SharedStateInterface {
  isAuth: boolean;
  isLoading: boolean;
}

function state(): SharedStateInterface {
  return {
    isAuth: false,
    isLoading: false,
  };
}

export default state;
