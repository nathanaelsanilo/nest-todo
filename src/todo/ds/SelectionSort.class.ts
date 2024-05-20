type SortOrder = 'asc' | 'des';

export class SelectionSort {
  static sort(arr: number[]) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      // index yang menyimpan element paling kecil
      let min_index = i;

      // cari index yang memiliki nilai lebih kecil
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[min_index]) {
          min_index = j;
        }
      }

      // swap
      //   const temp = arr[min_index];
      //   arr[min_index] = arr[i];
      //   arr[i] = temp;
      [arr[i], arr[min_index]] = [arr[min_index], arr[i]];
    }
  }

  static lessThan(a, b): boolean {
    return a < b;
  }

  static greaterThan(a, b): boolean {
    return a > b;
  }

  static sortObject<TObject>(
    arr: TObject[],
    conf: { key: keyof TObject; order: SortOrder },
  ) {
    const n = arr.length;
    const { key, order } = conf;
    const method =
      order === 'asc' ? SelectionSort.lessThan : SelectionSort.greaterThan;

    for (let i = 0; i < n - 1; i++) {
      let min_index = i;

      for (let j = i + 1; j < n; j++) {
        if (method(arr[j][key], arr[min_index][key])) {
          min_index = j;
        }
      }

      [arr[i], arr[min_index]] = [arr[min_index], arr[i]];
    }
  }
}
