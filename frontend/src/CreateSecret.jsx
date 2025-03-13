import { useState, useEffect } from "react";
import axios from "axios";


const CreateSecret = () => {
  const [secret, setSecret] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (slug) {
      setUrl(`${window.location.origin}${slug}`);
    } else {
      setUrl("");
    }
  }, [slug]);
  const [error, setError] = useState("");

  const createSecret = async () => {
    setError("");
    setSlug("");
    setUrl("");
    try {
      const res = await axios.post("https://avikant.com/paste-api/create", {
        secret,
        passphrase,
      });
      setSlug(`/secret/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || "Error creating secret.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard!");
    }).catch(err => {
      setError("Failed to copy URL.");
    });
  };

  return (
    <div className="container mx-auto max-w-xl p-5 space-y-4">
      <textarea
        className="border p-3 w-full rounded"
        placeholder="Enter your secret password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />
      <input
        type="password"
        className="border p-3 w-full rounded"
        placeholder="Set a passphrase"
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
      />
      <button
        onClick={createSecret}
        className="bg-blue-500 text-white p-3 rounded w-full"
      >
        Create Secret Link
      </button>
      {url && (
        <div className="break-words">
          Your secret URL: <a href={url}>{url}</a>
          <button
            onClick={copyToClipboard}
            className="bg-green-500 text-white p-2 rounded ml-2"
          >
            Copy URL
          </button>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default CreateSecret;
