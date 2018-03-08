import * as React from "react";
import { ITsrpcClient, TsrpcPtl } from "tsrpc-protocol";
import SuperPromise from "k8w-super-promise";
import FulltsApp from './FulltsApp';
import { TsrpcClient } from "tsrpc-browser";
import * as PropTypes from 'prop-types';

export default class FulltsComponent<P={}, S={}> extends React.Component<P, S> implements ITsrpcClient {
    static contextTypes = {
        fullTsApp: PropTypes.instanceOf(FulltsApp)
    }

    constructor(props: P, context?: any) {
        super(props, context);

        //componentWillUnmount cancel all api requests
        if (this.componentWillUnmount) {
            let originalFunc = this.componentWillUnmount;
            this.componentWillUnmount = () => {
                this._componentWillUnmount();
                originalFunc();
            }
        }
        else {
            this.componentWillUnmount = this._componentWillUnmount;
        }
    }

    protected _apiRequests: { [sn: number]: SuperPromise<any> } = {};
    callApi<Req, Res>(ptl: TsrpcPtl<Req, Res>, req?: Req): SuperPromise<Res> {
        //ADD TO CONN POOL AND POP WHEN DISPOSE
        let conn = this.app.callApi(ptl, req);
        let sn = TsrpcClient.getLastReqSn();
        this._apiRequests[sn] = conn;

        //pop when complete
        conn.always(() => {
            delete this._apiRequests[sn];
        }).onCancel(() => {
            delete this._apiRequests[sn];
        })

        return conn;
    }

    /**
     * Current FullTSApp Instance
     */
    get app(): FulltsApp {
        return this.context.fullTsApp;
    }

    private _componentWillUnmount() {
        this._cancelAllApiRequest();

        //clearTimeout
        for (let timer of this._setTimeoutTimers) {
            clearTimeout(timer);
            this._setTimeoutTimers = undefined as any;
        }

        //clearInterval
        for (let timer of this._setIntervalTimers) {
            clearInterval(timer);
            this._setIntervalTimers = undefined as any;
        }

        //clear global event listeners
        for (let item of this._globalEventListeners) {
            item.target.removeEventListener(item.type, item.listener, item.options);
            this._globalEventListeners = undefined as any;
        }
    }

    private _cancelAllApiRequest() {
        for (let sn in this._apiRequests) {
            if (this._apiRequests.hasOwnProperty(sn)) {
                this._apiRequests[sn].cancel();
            }
        }
    }

    private _setTimeoutTimers: number[] = [];
    /**
     * 同原生setTimeout 但uncomponent时会自动清除
     * @param handler 
     * @param ms 
     */
    setTimeout(handler: () => void, ms: number): number {
        let timer = setTimeout(() => {
            handler();
            let index = this._setTimeoutTimers.binarySearch(timer);
            if (index > -1) {
                this._setTimeoutTimers.splice(index, 1);
            }
        }, ms)
        this._setTimeoutTimers.binaryInsert(timer);
        return timer;
    }

    private _setIntervalTimers: number[] = [];
    /**
     * 同原生setInterval 但uncomponent时会自动清除
     * @param handler 
     * @param ms 
     */
    setInterval(handler: () => void, ms: number): number {
        let timer = setInterval(() => {
            handler();
            let index = this._setIntervalTimers.binarySearch(timer);
            if (index > -1) {
                this._setIntervalTimers.splice(index, 1);
            }
        }, ms)
        this._setIntervalTimers.binaryInsert(timer);
        return timer;
    }

    private _globalEventListeners: {
        target: EventTarget,
        type: string,
        listener: EventListener,
        options?: boolean | EventListenerOptions
    }[] = [];
    /**
     * 同xxx.addEventListener unmount时会自动removeEventListener
     * @param target 
     * @param type 
     * @param listener 
     * @param options 
     */
    addEventListener<T extends Event=Event>(target: EventTarget, type: string, listener: (e: T) => void, options?: boolean | AddEventListenerOptions) {
        target.addEventListener(type, listener as EventListener, options);
        this._globalEventListeners.push({ target: target, type: type, listener: listener as EventListener, options: options });
    }
}