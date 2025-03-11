import CreateSecret from "./CreateSecret";
import RetrieveSecret from "./RetrieveSecret";

const App = () => {
  const isSecretPage = window.location.pathname.startsWith("/secret/");
  const secretId = window.location.pathname.split("/").pop();

  return (
    <div className="container mx-auto max-w-xl p-5">
      {isSecretPage ? (
        <RetrieveSecret secretId={secretId} />
      ) : (
        <CreateSecret />
      )}
    </div>
  );
};

export default App;
