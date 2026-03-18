import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

function Wallet(){

  const [wallet,setWallet] = useState(0);

  const token = localStorage.getItem("token");

  const fetchWallet = async () => {

    const res = await axios.get(
      "https://backend2-3avp.onrender.com/api/users/wallet",
      {
        headers:{ Authorization:`Bearer ${token}` }
      }
    );

    setWallet(res.data.wallet);

  };

  useEffect(()=>{
    fetchWallet();
  },[]);

  return(
    <div>

      <Navbar/>

      <div className="p-10 text-center">

        <h1 className="text-3xl font-bold mb-5">
          My Wallet
        </h1>

        <div className="text-4xl text-green-600 font-bold">
          ₹{wallet}
        </div>

      </div>

    </div>
  );
}

export default Wallet;