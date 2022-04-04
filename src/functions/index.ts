// export async function getAuthentification() {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     console.log('Токен не найден');
//     return;
//   }
//   try {
//     const response = await fetch('http://localhost:3000/auth/auth', {
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
