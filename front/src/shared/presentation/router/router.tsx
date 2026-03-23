import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import { DashboardLayout } from "../layouts/DashBoardLayout";
import { BookPage } from "@/modules/book/presentation/BookPage";
import HomePage from "@/modules/homePage/presentation/Home";
import { BookFromPage } from "@/modules/book/presentation/BookFromPage";
import { LoginPage } from "@/modules/auth/presentation/page/LoginPage";

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

            children: [
              {
                path: "", // /dashboard/books → lista
                element: <BookPage />,
              },
              {
                path: ":id",
                element: <BookFromPage />,
              },
            ],
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
