import { RouteComponentProps } from 'react-router';

export default interface FullTsAppConfig {
    serverUrl: string,
    routes: FullTsAppRoute[]
}

export interface FullTsAppRoute {
    path: string;
    component?: React.ComponentType | (() => PromiseLike<{ default: React.ComponentType }>);
    render?: ((props: RouteComponentProps<any>) => (React.ReactNode | PromiseLike<React.ReactNode>));
}