import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import EditUser from "./EditUser";
import MessageContext from "../contexts/MessageContext";

export default function App() {
  const [message, setMessage] = useState(null);

  // Set message to null automatically after a period of time.
  useEffect(() => {
    if(message === null)
      return;

    const id = setTimeout(() => setMessage(null), 5000);

    // When message changes clear the queued timeout function.
    return () => clearTimeout(id);
  }, [message]);

  return (
      <div className="d-flex flex-column min-vh-100 bg-dark" id="top">
        <MessageContext.Provider value={{ message, setMessage }}>
          <Router>
            <Navbar />
            <main role="main">
              <div className="container my-3">
                <Switch>
                  <Route path="/edit/:userid">
                    <EditUser />
                  </Route>
                  <Route path="/">
                    <Dashboard />
                  </Route>
                </Switch>
              </div>
            </main>
            <Footer />
          </Router>
        </MessageContext.Provider>
      </div>
  );
}
