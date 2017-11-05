import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FullTsAppConfig from './FullTsAppConfig';
import { ITsRpcClient, TsRpcPtl } from 'tsrpc-protocol';
import SuperPromise from 'k8w-super-promise';
import { RpcClient } from 'tsrpc-browser';
import * as PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route, RouteComponentProps } from 'react-router-dom';
import FullTsRouteRender from './FullTsRouteRender';

export default class FullTsApp implements ITsRpcClient {
    protected rpcClient: RpcClient;
    readonly config: FullTsAppConfig;

    /**
     * params from route match
     */
    params: any;
    /**
     * params from parse query string
     */
    query: { [key: string]: string } = {};

    //Router
    history: RouteComponentProps<any>['history'];
    location: RouteComponentProps<any>['location'];
    match: RouteComponentProps<any>['match'];

    constructor(config: FullTsAppConfig) {
        this.config = config;
        this.rpcClient = new RpcClient({
            serverUrl: this.config.serverUrl
        })
    }

    protected _apiRequests: { [sn: number]: SuperPromise<any> } = {};
    callApi<Req, Res>(ptl: TsRpcPtl<Req, Res>, req?: Req): SuperPromise<Res> {
        //TODO ADD TO CONN POOL AND DISPOSE
        let conn = this.rpcClient.callApi(ptl, req);
        let sn = RpcClient.getLastReqSn();
        this._apiRequests[sn] = conn;

        //pop when complete
        conn.always(() => {
            delete this._apiRequests[sn];
        }).onCancel(() => {
            delete this._apiRequests[sn];
        })

        return conn;
    }

    protected _domTarget: HTMLElement;
    renderTo(domTarget: HTMLElement) {
        this._domTarget = domTarget;
        ReactDOM.render(<FullTsAppContainer app={this} />, domTarget);
    }

    dispose() {
        this._domTarget && ReactDOM.unmountComponentAtNode(this._domTarget);
        this._domTarget = undefined as any;
        this.cancelAllApiRequest();
    }

    cancelAllApiRequest() {
        for (let sn in this._apiRequests) {
            if (this._apiRequests.hasOwnProperty(sn)) {
                this._apiRequests[sn].cancel();
            }
        }
    }

    /**
     * 设置页面标题
     * @param title
     */
    setTitle(title: string) {
        let titleNode: HTMLTitleElement | null = document.head.querySelector('title');
        if (!titleNode) {
            titleNode = document.createElement('title');
            document.head.appendChild(titleNode);
        }
        titleNode.innerText = title;
    }

    /**
     * 设置SEO用到的Meta信息
     * @param meta
     */
    setSeoMeta(meta: {
        keywords: string[] | null,
        description: string | null
    }) {
        let keywordsNode: HTMLMetaElement | null = document.head.querySelector('meta[name=keywords]');
        if (meta.keywords && meta.keywords.length) {
            if (!keywordsNode) {
                keywordsNode = document.createElement('meta');
                keywordsNode.name = 'keywords';
                document.head.appendChild(keywordsNode);
            }
            keywordsNode.content = meta.keywords.join();
        }
        else {
            keywordsNode && keywordsNode.remove();
        }

        let descNode: HTMLMetaElement | null = document.head.querySelector('meta[name=description]');
        if (meta.description) {
            if (!descNode) {
                descNode = document.createElement('meta');
                descNode.name = 'description';
                document.head.appendChild(descNode);
            }
            descNode.content = meta.description;
        }
        else {
            descNode && descNode.remove();
        }
    }
}

class FullTsAppContainer extends React.Component<{ app: FullTsApp }> {
    static childContextTypes = {
        fullTsApp: PropTypes.instanceOf(FullTsApp)
    }

    getChildContext() {
        return {
            fullTsApp: this.props.app
        };
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {this.props.app.config.routes.map((v, i) =>
                        <Route key={i} path={v.path} exact render={props => {
                            let prevLocation = this.props.app.location;
                            let prevParams = this.props.app.params;
                            let prevQuery = this.props.app.query;
                            this.props.app.history = props.history;
                            this.props.app.match = props.match;
                            this.props.app.location = props.location;
                            this.props.app.params = props.match.params;
                            this.props.app.query = this.parseQueryString(props.location.search);
                            
                            //event
                            this.props.app.config.onRouteChange && this.props.app.config.onRouteChange({
                                prevLocation: prevLocation,
                                prevParams: prevParams,
                                prevQuery: prevQuery,
                                nextLocation: this.props.app.location,
                                nextParams: this.props.app.params,
                                nextQuery: this.props.app.query
                            });

                            return <FullTsRouteRender route={v} routeProps={props} />
                        }} />
                    )}
                </Switch>
            </BrowserRouter>
        );
    }

    private parseQueryString(search: string): { [key: string]: string }{
        if (!search) {
            return {};
        }

        let paramStrs = search.replace(/^\?/, '').split('&');
        let output: any = {};
        for (let str of paramStrs) {
            let equalPos = str.indexOf('=');
            if (equalPos > -1) {
                output[str.slice(0, equalPos)] = decodeURIComponent(str.slice(equalPos+1))
            }
            else {
                output[str] = '';
            }
        }

        return output;
    }
}