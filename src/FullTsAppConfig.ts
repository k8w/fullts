import { RouteComponentProps } from 'react-router';
import FullTsApp from './FullTsApp';

export interface RouteChangeEvent {
    target: FullTsApp;
    prevLocation?: RouteComponentProps<any>['location'];
    prevParams?: any;
    prevQuery?: { [key: string]: string };
}

export default interface FullTsAppConfig {
    /**
     * TSRPC服务端地址 例如 http://test.com/api
     */
    serverUrl: string;
    routes: FullTsAppRoute[];
    onRouteChange?: (e: RouteChangeEvent) => void;

    /**
     * always scroll to top when route change
     * @default true
     */
    alwaysScrollTop?: boolean;

    /**
     * always remount view components when route change
     * @default true
     */
    alwaysRemount?: boolean;

    /**
     * always remount layout components when route change
     * If layout is remounted, view must be remounted too
     * @default false
     */
    alwaysRemountLayout?: boolean;
}

export interface FullTsAppRoute {
    path: string;
    component: React.ComponentType<any> | (() => PromiseLike<{ default: React.ComponentType<any> }>);
    layout?: React.ComponentType<any> | (() => PromiseLike<{ default: React.ComponentType<any> }>);
    // render?: ((props: RouteComponentProps<any>) => (React.ReactNode | PromiseLike<React.ReactNode>));
}

export const DefaultFullTsAppConfig: FullTsAppConfig = {
    serverUrl: '',
    routes: [],
    alwaysScrollTop: true,
    alwaysRemount: true,
    alwaysRemountLayout: false
}