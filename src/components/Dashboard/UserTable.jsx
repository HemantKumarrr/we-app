import React from "react";

const UserTable = ({ item }) => {
  return (
    <>
      <td>{item.email}</td>
      <td>{item.role}</td>
      <td>{item.age}</td>
    </>
  );
};

export default UserTable;
