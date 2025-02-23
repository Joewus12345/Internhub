import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "About",
    path: "/about",
    newTab: false,
  },
  {
    id: 20,
    title: "Blog",
    path: "/blog",
    newTab: false,

  },
  {
    id: 4,
    title: "Help",
    path: "",
    newTab: false,
    submenu: [
      {
        id: 41,
        title: "About Page",
        path: "/about",
        newTab: false,
      },
      {
        id: 42,
        title: "Contact Page",
        path: "/contact",
        newTab: false,
      },

    ],
  },
  // {
  //   id: 3,
  //   title: "Sign in to get started",
  //   path: "",
  //   newTab: false,
  //   submenu: [
  //     {
  //       id: 43,
  //       title: "Students Sign in",
  //       path: "/student",
  //       newTab: false,
  //     },
  //     {
  //       id: 44,
  //       title: "Employers / Post jobs",
  //       path: "/recruit",
  //       newTab: false,
  //     },

  //   ],
  // },
];
export default menuData;
