import { createContext, useEffect, useState } from "react";

export const DataContext = createContext<any>([]);
export const OptionContext = createContext<any> ({});
export const LoadingContext = createContext(false);