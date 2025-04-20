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
  const [searchText, setSearchText] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <>
      <div className="pt-10 ">
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm to Delete account"
        >
          <div className="">
            <button
              onClick={() => {
                deleteUser(selectedUser);
                setModalOpen(false);
                setSelectedUser(null);
              }}
              className="px-4 py-1 cursor-pointer text-sm bg-red-600 text-white"
            >
              Delete account
            </button>
          </div>
        </ConfirmModal>
        <h1 className="">Users</h1>
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
                className="border border-gray-200 py-1 rounded-xl px-4"
              />
            </div>
            <table className="w-full border border-gray-700 text-center">
              <thead>
                <tr className="bg-elevated">
                  <th className="border border-gray-700 px-2 text-sm py-2">
                    Username
                  </th>
                  <th className="border border-gray-700 px-2 text-sm">Email</th>
                  <th className="border border-gray-700 px-2 text-sm">Role</th>
                  <th className="border border-gray-700 px-2 text-sm">Age</th>
                  <th className="border border-gray-700 px-2 text-sm">Join</th>
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
                    console.log(
                      "Username: " + item?.username + " UID:" + item?._id
                    );

                    return (
                      <tr key={item?._id} className="border border-gray-700">
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
                                setSelectedUser(item?._id);
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
    </>
  );
};

export default DashBoard;
