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
