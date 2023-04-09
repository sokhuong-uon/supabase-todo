import { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <div className="relative w-screen h-screen overflow-hidden ">{children}</div>;
};
export { Layout };
