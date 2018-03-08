import { RouteComponentProps } from 'react-router';
import FulltsApp from './FulltsApp';

export interface RouteChangeEvent {
    target: FulltsApp;
    prevLocation?: RouteComponentProps<any>['location'];
    prevParams?: any;
    prevQuery?: { [key: string]: string };
}

export default interface FulltsAppConfig {
    /**
     * TSRPC服务端地址 例如 http://test.com/api
     */
    serverUrl: string;
    routes: FulltsAppRoute[];
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

export interface FulltsAppRoute {
    path: string;
    component: React.ComponentType<any> | (() => PromiseLike<{ default: React.ComponentType<any> }>);
    layout?: React.ComponentType<any> | (() => PromiseLike<{ default: React.ComponentType<any> }>);
    // render?: ((props: RouteComponentProps<any>) => (React.ReactNode | PromiseLike<React.ReactNode>));
}

export const DefaultFulltsAppConfig: FulltsAppConfig = {
    serverUrl: '',
    routes: [],
    alwaysScrollTop: true,
    alwaysRemount: true,
    alwaysRemountLayout: false
}