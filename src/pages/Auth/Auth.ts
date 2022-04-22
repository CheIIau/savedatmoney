import { QVueGlobals } from 'quasar';

export async function fetchRegister(
  username: string,
  password: string,
): Promise<AuthResponse> {
  return (await fetch('http://localhost:3000/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })) as AuthResponse;
}

export async function fetchLogin(
  username: string,
  password: string,
): Promise<AuthResponse> {
  return (await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })) as AuthResponse;
}

export async function requestAuthHandler(
  cb: typeof fetchRegister,
  username: string,
  password: string,
  q: QVueGlobals,
) {
  let message;
  let resJson;
  try {
    const response = await cb(username, password);
    resJson = (await response.json()) as AuthResponse;
    message = resJson.message;
    if (response.status === 400) {
      throw new Error(message);
    }
  } catch (error) {
    const message = (error as Error).message;
    q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message,
    });
    throw new Error('Что-то пошло не так');
  }
  q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message,
  });
  if (resJson.userId && resJson.token) {
    return { userId: resJson.userId, token: resJson.token } as AuthCredentials;
  }
  // else {
  //   q.notify({
  //     color: 'red-5',
  //     textColor: 'white',
  //     icon: 'warning',
  //     message: 'Что-то не так в запросе',
  //   });
  // }
}

export interface AuthCredentials {
  userId: string;
  token: string;
}

export function storeUserData(
  userId: string,
  token: string,
  username: string,
): void {
  localStorage.setItem('userId', userId);
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
}

interface AuthResponse extends Response {
  message: string;
  token?: string;
  userId?: string;
}
