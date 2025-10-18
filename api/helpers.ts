export type Result<Error, T> =
  | {
      result: T;
    }
  | {
      error: Error;
    };
export const isError = <Error, T>(
  result: Result<Error, T>
): result is Extract<Result<Error, T>, { error: Error }> => "error" in result;
export const isResult = <Error, T>(
  result: Result<Error, T>
): result is Extract<Result<Error, T>, { result: T }> => "result" in result;
export const error = <Error>(error: Error) => ({
  error,
});
export const result = <T>(result: T) => ({
  result,
});
