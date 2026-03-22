import { createBrowserRouter } from "react-router";
import { Root } from "./Root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/dashboard",
        element: <h1>Dashboard</h1>,
      },
    ],
  },
]);
