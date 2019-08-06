import { ExpressionDescriptor } from "./expressionDescriptor";
import { enLocaleLoader } from "./i18n/enLocaleLoader";

ExpressionDescriptor.initialize(new enLocaleLoader());
export default ExpressionDescriptor;

let toString = ExpressionDescriptor.toString;
let parse = ExpressionDescriptor.parse;
let stringify = ExpressionDescriptor.stringify;
export { toString, parse, stringify };
