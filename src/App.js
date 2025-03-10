 import { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
 import PasswordScreen from "./components/PasswordScreen";

function App() {
   const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">



       {!isUnlocked ? (
        <PasswordScreen onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <div className="mx-auto max-w-7xl">
          <InvoiceForm />
        </div>
      )} 
    </div>
  );
}

export default App;
