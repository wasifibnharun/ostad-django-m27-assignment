import { createContext } from 'react';

// [REQ-14] A second Context, deliberately split into a state context and an actions context
export const WatchlistStateContext = createContext(undefined);
export const WatchlistActionsContext = createContext(undefined);