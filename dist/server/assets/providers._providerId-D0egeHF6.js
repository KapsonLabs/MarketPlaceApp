import { jsx } from "react/jsx-runtime";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-20 text-center text-destructive", children: error.message });
export {
  SplitErrorComponent as errorComponent
};
