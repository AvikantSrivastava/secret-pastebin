import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from "react-router-dom";
import CreateSecret from "./CreateSecret";
import RetrieveSecret from "./RetrieveSecret";

const SecretPage = () => {
  const { secretId } = useParams();
  return <RetrieveSecret secretId={secretId} />;
};

const App = () => {
  return (
    <Router basename="/">
      <div className="container mx-auto max-w-xl p-5">
        <Routes>
          <Route path="/" element={<CreateSecret />} />
          <Route path="/secret/:secretId" element={<SecretPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
