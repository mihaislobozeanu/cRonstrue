import { ExpressionDescriptor } from "./expressionDescriptor";
export default ExpressionDescriptor;
declare let toString: typeof ExpressionDescriptor.toString;
declare let parse: typeof ExpressionDescriptor.parse;
declare let stringify: typeof ExpressionDescriptor.stringify;
declare let locales: {
    [name: string]: import("./i18n/locale").Locale;
};
export { toString, parse, stringify, locales };
