import { useState } from "react";
import axios from "axios";

const RetrieveSecret = ({ secretId }) => {
  const [passphrase, setPassphrase] = useState("");
  const [retrievedSecret, setRetrievedSecret] = useState("");
  const [error, setError] = useState("");

  const retrieveSecret = async () => {
    setError("");
    try {
      const res = await axios.post(
        `https://avikant.com/paste-api/secret/${secretId}`,
        { passphrase },
      );
      setRetrievedSecret(res.data.secret);
    } catch (err) {
      setError(err.response?.data?.error || "Error retrieving secret.");
    }
  };


  return (
    <div className="container mx-auto max-w-xl p-5 space-y-4">
      {!retrievedSecret && (
        <>
          <input
            type="password"
            className="border p-3 w-full rounded"
            placeholder="Enter passphrase to decrypt"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          <button
            onClick={retrieveSecret}
            className="bg-green-500 text-white p-3 rounded w-full"
          >
            Retrieve Secret
          </button>
        </>
      )}

      {retrievedSecret && (
        <div className="bg-gray-200 p-4 rounded space-y-2">
          <div>
            Your secret: <strong>{retrievedSecret}</strong>
          </div>
          <a href="/" className="text-blue-500">Create new secret</a>
        </div>
      )}

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default RetrieveSecret;
