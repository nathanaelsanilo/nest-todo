import { SelectionSort } from './SelectionSort.class';

describe('Selection Sort', () => {
  it('should sort value', () => {
    const arr = [64, 25, 11, 59, 9];

    SelectionSort.sort(arr);

    expect(arr).toEqual([9, 11, 25, 59, 64]);
  });
});
