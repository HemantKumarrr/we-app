import { toast } from "react-hot-toast";
import { api } from "../api/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import { canDeleteUser } from "../utils/permissions";
import ConfirmModal from "../components/modals/ConfirmModal";

const DashBoard = () => {
  const currentUser = useSelector((state) => state.auth.user.user);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ username: "", uid: "" });

  const fetchUserList = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/getAll-users/${currentUser._id}`, {
        withCredentials: true,
      });
      setUserList(response.data);
      if (response.data.error) {
        setIsLoading(false);
        return toast.error(response.data.error);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err.message);
      toast.error(err.message);
    }
  };

  const deleteUser = async (uid) => {
    try {
      const response = await api.delete(`/account-delete/${uid}`, {
        withCredentials: true,
      });
      toast.success("User deleted");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filterdList = userList?.dataList?.filter((item) => {
    if (searchText === "") return item;
    return item.username.toLowerCase().includes(searchText.toLowerCase());
  });

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <div className="pt-10">
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm to Delete account"
        >
          <div className="flex flex-col items-center justify-center">
            <p className="py-2 text-white text-center text-xl font-semibold">
              User : {selectedUser.username}
            </p>
            <button
              onClick={() => {
                deleteUser(selectedUser.uid);
                setModalOpen(false);
                setSelectedUser({ username: "", uid: "" });
              }}
              className="px-4 flex items-center gap-2 py-1 rounded-xs cursor-pointer text-sm text-center mt-4 bg-red-600 text-white"
            >
              Delete account
              <MdDeleteForever size={16} />
            </button>
          </div>
        </ConfirmModal>
        <h1 className="bg-gray-900 inline-block px-4 py-1 rounded-full">
          All Users
        </h1>
        <div className="">
          <div className="">
            <p className="py-2 font-semibold text-gray-300 text-xl">
              Total Users : {userList.count}
            </p>
            <div className="search py-4">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="search..."
                className="border outline-none border-gray-300 py-1 rounded-sm px-4"
              />
            </div>
            <div className="w-full overflow-x-scroll sm:overflow-x-hidden border-4 border-gray-900 rounded-md">
              <table className="w-full border border-gray-800 text-center">
                <thead>
                  <tr className="bg-elevated">
                    <th className="border border-gray-700 px-2 text-sm py-2">
                      Username
                    </th>
                    <th className="border border-gray-700 px-2 text-sm">
                      Email
                    </th>
                    <th className="border border-gray-700 px-2 text-sm">
                      Role
                    </th>
                    <th className="border border-gray-700 px-2 text-sm">Age</th>
                    <th className="border border-gray-700 px-2 text-sm">
                      Join
                    </th>
                    <th className="border border-gray-700 px-2 text-sm">
                      Delete
                    </th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr>
                      <td>
                        <div className="py-4 text-center animate-pulse">
                          Loading...
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {userList?.dataList?.map((item) => {
                      const formattedDate = new Date(
                        item.createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <tr
                          key={item?._id}
                          className={`border border-gray-700 hover:bg-gray-900`}
                        >
                          <td className="text-sm py-2 px-4 border border-gray-700">
                            {item?.username}
                          </td>
                          <td className="text-sm py-2 px-4 border border-gray-700">
                            {item?.email}
                          </td>
                          <td className="text-sm py-2 px-4 border border-gray-700">
                            {item?.role}
                          </td>
                          <td className="text-sm py-2 px-4 border border-gray-700">
                            {item?.age || "NA"}
                          </td>
                          <td className="text-sm py-2 px-4 border border-gray-700">
                            {formattedDate}
                          </td>
                          {canDeleteUser(currentUser) && (
                            <td className="text-sm py-2 px-4 border border-gray-700">
                              <button
                                onClick={() => {
                                  setModalOpen((prev) => !prev);
                                  setSelectedUser({
                                    username: item?.username,
                                    uid: item?._id,
                                  });
                                }}
                                className="hover:text-red-600 cursor-pointer"
                              >
                                <MdDeleteForever size={18} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
