export function formatDate(dateVal: string) {
  const months = [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ];
  const date = new Date(dateVal);
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const hour = date.getHours();
  const day = date.getDate();
  const min =
    date.getMinutes() < 10
      ? '0' + String(date.getMinutes())
      : date.getMinutes();
  const time =
    String(day) +
    ' ' +
    String(month) +
    ' ' +
    String(year) +
    ' ' +
    String(hour) +
    ':' +
    String(min);
  return time;
}

// export async function getAuthentification() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     console.log('Токен не найден');
//     return;
//   }
//   try {
//     const response = await fetch('/auth/auth', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const resJson = (await response.json()) as AuthResponse;
//     const message = resJson.message;
//     if (response.status === 400 || !resJson.token) {
//       throw new Error(message);
//     }
//     return { userId: resJson.userId!, token: resJson.token };
//   } catch (error) {
//     const message = (error as Error).message;
//     console.log(message);
//   }
// }

// export interface AuthResponse extends Response {
//   message: string;
//   token?: string;
//   userId?: string;
// }
