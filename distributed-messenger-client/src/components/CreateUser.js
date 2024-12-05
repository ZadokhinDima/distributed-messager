import React, { useState } from "react";
import { postRequest } from "../api";

const CreateUser = () => {
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    const result = await postRequest("/write/user", { username });
    alert(result.error ? result.error : `User Created: ${JSON.stringify(result)}`);
    setUsername("");
  };

  return (
    <div>
      <h2>Create User</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <button onClick={handleSubmit}>Create User</button>
    </div>
  );
};

export default CreateUser;
