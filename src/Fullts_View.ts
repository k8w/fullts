import FulltsComponent from "./FulltsComponent";
import { RouteComponentProps } from "react-router";

/**
 * `FullTSView` is `FulltsComponent` which is assigned as route component.
 * Its props would have `react-router` props, like `history`, `location`, and `match`.
 */
export default class FulltsView<P={}, S={}> extends FulltsComponent<P & RouteComponentProps<any>, S> {

}