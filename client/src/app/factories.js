import { clearError } from "./helpers";

export const messageHandlerFactory = (sequence) => [
  clearError,
  ...sequence,
] ;
