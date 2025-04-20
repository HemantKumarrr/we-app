import { Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import TotalPosts from "./TotalPosts";

const SideBar = () => {
  const menuItems = [
    { path: "/admin/dashboard/users", label: "Users", component: <Users /> },
    {
      path: "/admin/dashboard/posts",
      label: "Total Posts",
      component: <TotalPosts />,
    },
  ];

  return (
    <div>
      <div className="border border-gray-400 h-[30rem] py-8 w-[10rem] rounded-xl shadow">
        <div className="flex flex-col justify-center items-center gap-4">
          {menuItems.map((item) => {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `w-full cursor-pointer text-center py-1 ${
                    isActive
                      ? "border-b-blue-500 bg-blue-200 border-b-4"
                      : "border-b border-gray-400"
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
