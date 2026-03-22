import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import { DashboardLayout } from "../layouts/DashBoardLayout";
import Home from "@/modules/book/BookHomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "books",
            element: <h1>Books </h1>,
          },
        ],
      },
    ],
  },
]);
