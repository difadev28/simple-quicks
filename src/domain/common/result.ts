export interface Result<T> {
  isSuccess: boolean;
  isFailure: boolean;
  error?: Error;
  value?: T;
}

export const success = <T>(value: T): Result<T> => ({
  isSuccess: true,
  isFailure: false,
  value,
});

export const failure = <T>(error: Error): Result<T> => ({
  isSuccess: false,
  isFailure: true,
  error,
});

export const fold = <T, U>(
  result: Result<T>,
  onSuccess: (value: T) => U,
  onFailure: (error: Error) => U
): U => {
  if (result.isSuccess && result.value !== undefined) {
    return onSuccess(result.value);
  }
  return onFailure(result.error || new Error('Unknown error'));
};