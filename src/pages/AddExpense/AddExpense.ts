export const quantityRules = [
  (val: number) => typeof val === 'number' || 'Пожайлуйста, введите число',
  (val: number) => {
    if (val.toString().includes('.')) {
      return (
        (val && val.toString().split('.').pop()!.length <= 2) ||
        'Должно быть 2 цифры после запятой'
      );
    }
    return true;
  },
];

export const categoryIcons = [
  { name: 'shopping_cart', color: 'green' },
  { name: 'home', color: 'indigo-10' },
  { name: 'directions_car', color: 'cyan' },
  { name: 'checkroom', color: 'pink-12' },
  { name: 'favorite', color: 'deep-purple' },
  { name: 'local_cafe', color: 'red-13' },
  { name: 'sports_soccer', color: 'light-green-14' },
  { name: 'shop', color: 'teal-5' },
  { name: 'chair', color: 'deep-orange' },
  { name: 'pets', color: 'purple' },
  { name: 'more_horiz', color: 'lime' },
];

export function getRandomColor() {
  function randomNumber() {
    return Math.ceil(Math.random() * (255 - 50) + 50);
  }
  const red = randomNumber();
  const green = randomNumber();
  const blue = randomNumber();
  return `rgb(${red}, ${green}, ${blue})`;
}
