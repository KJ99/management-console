import { createContext, FC, lazy, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as StringResources from '../resources/strings';

const flat = (subject: any, prefix: string = ''): any => {
    let result: any = {};
    Object.keys(subject).forEach((key: string) => {
        if (typeof subject[key] == 'object' && subject[key] != null) {
            result = {
                ...result,
                ...flat(subject[key], [prefix, key].join('/'))
            };
        } else {
            result[[prefix, key].join('/')] = subject[key];
        }
    });

    return result;
}

export interface IStringContext {
    strings: (resourceName: string, ...args: any[]) => string;
}

export const StringsContext = createContext<IStringContext>({ strings: (n: string) => '' });

export const StringsProvider: FC = ({ children }) => {
    const resources = useMemo<any>(() => flat(StringResources.default), []);

    const strings = useCallback((resourceName: string, ...args: any[]) => {
        let res = resources[resourceName] ?? '';
        for(let i = 0; i < args.length; i++) {
            const val = args[i] != null ? args[i] : '';
            res = res.replace(`$${i + 1}`, val);
        }

        return res;
    }, [resources]);

    return (
        <StringsContext.Provider value={{ strings }}>
            {children}
        </StringsContext.Provider>
    );
} 