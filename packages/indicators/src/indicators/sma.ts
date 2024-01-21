export function SMA(data: number[], period: number): number[] {
  if (data.length < period) {
    throw new Error("Not enough data points for the given period.");
  }

  const smaValues: number[] = [];
  let sum = 0;

  for (let i = 0; i < period; i++) {
    sum += data[i];
  }

  smaValues.push(sum / period);

  for (let i = period; i < data.length; i++) {
    sum = sum - data[i - period] + data[i];
    smaValues.push(sum / period);
  }

  return smaValues;
}
