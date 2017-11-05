import { RouteComponentProps } from 'react-router';

export interface RouteChangeEvent {
    prevLocation?: RouteComponentProps<any>['location'];
    prevParams?: any;
    prevQuery?: { [key: string]: string };
    nextLocation: RouteComponentProps<any>['location'];
    nextParams: any;
    nextQuery: { [key: string]: string };
}

export default interface FullTsAppConfig {
    /**
     * TSRPC服务端地址 例如 http://test.com/api
     */
    serverUrl: string,
    routes: FullTsAppRoute[],
    onRouteChange?: (e: RouteChangeEvent) => void;
}

export interface FullTsAppRoute {
    path: string;
    component?: React.ComponentType | (() => PromiseLike<{ default: React.ComponentType }>);
    layout?: React.ComponentType | (() => PromiseLike<{ default: React.ComponentType }>);
    // render?: ((props: RouteComponentProps<any>) => (React.ReactNode | PromiseLike<React.ReactNode>));
}