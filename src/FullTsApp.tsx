import * as React from 'react';
import * as ReactDOM from 'react-dom';
import FullTsAppConfig, { DefaultFullTsAppConfig } from './FullTsAppConfig';
import { ITsRpcClient, TsRpcPtl } from 'tsrpc-protocol';
import SuperPromise from 'k8w-super-promise';
import { RpcClient } from 'tsrpc-browser';
import * as PropTypes from 'prop-types';
import { BrowserRouter, RouteComponentProps } from 'react-router-dom';
import FullTsRouteSwitch from './FullTsRouteSwitch';

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
        this.config = Object.merge({}, DefaultFullTsAppConfig, config);
        this.rpcClient = new RpcClient({
            serverUrl: this.config.serverUrl
        })
    }

    protected _apiRequests: { [sn: number]: SuperPromise<any> } = {};
    callApi<Req, Res>(ptl: TsRpcPtl<Req, Res>, req?: Req): SuperPromise<Res> {
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
        let keywordsNode = document.head.querySelector('meta[name=keywords]') as HTMLMetaElement | null;
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

        let descNode = document.head.querySelector('meta[name=description]') as HTMLMetaElement | null;
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
                <FullTsRouteSwitch routes={this.props.app.config.routes} app={this.props.app} />
            </BrowserRouter>
        )
    }
}