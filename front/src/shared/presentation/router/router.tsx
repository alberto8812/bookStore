import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import { DashboardLayout } from "../layouts/DashBoardLayout";
import { BookPage } from "@/modules/book/presentation/BookPage";
import HomePage from "@/modules/homePage/presentation/Home";

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
            element: <HomePage />,
          },
          {
            path: "books",
            element: <BookPage />,
          },
        ],
      },
    ],
  },
]);
