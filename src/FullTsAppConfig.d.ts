import { FullTsRouteProps } from './FullTsRoute';
import { RouteComponentProps } from 'react-router';

export default interface FullTsAppConfig {
    serverUrl: string,
    routes: FullTsRouteProps[]
}