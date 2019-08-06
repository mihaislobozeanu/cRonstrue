import { ExpressionDescriptor } from "./expressionDescriptor";
import { allLocalesLoader } from "./i18n/allLocalesLoader";

ExpressionDescriptor.initialize(new allLocalesLoader());
export default ExpressionDescriptor;

let toString = ExpressionDescriptor.toString;
let parse = ExpressionDescriptor.parse;
let stringify = ExpressionDescriptor.stringify;
let locales = ExpressionDescriptor.locales;
export { toString, parse, stringify, locales };