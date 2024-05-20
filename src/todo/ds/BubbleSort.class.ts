export class BubbleSort {
  static sort(arr: number[]): void {
    const n = arr.length;
    let swapped = false;

    for (let i = 1; i < n - 1; i++) {
      // perulangan untuk melakukan swap
      // j < n - i batas maksimum element yang diurutkan
      for (let j = 0; j < n - i; j++) {
        const current = arr[j];
        const next = arr[j + 1];

        if (next < current) {
          // swap
          const temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;

          swapped = true;
        }
      }

      // jika list sudah urut keluar dari perulangan
      if (!swapped) break;
    }
  }
}
