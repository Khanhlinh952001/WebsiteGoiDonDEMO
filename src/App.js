import React, { useState, useEffect } from "react";
import { getDatabase, ref, child, get, push, set, remove, onValue, off } from "firebase/database";
import { auth } from "./Firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import moment from "moment";
import "./Login.css";
import "./App.css";
import Loading from "./Loading";

export default function App() {
  const [data, setData] = useState([]);
  const [calledOrders, setCalledOrders] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAd, setUserAd] = useState(null);
 
  
  
  

  useEffect(() => {
    const UserCall = () => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "Users"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const UserRef = snapshot.val();
            const users = Object.values(UserRef);
            setUserAd(users);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };

    UserCall();
  }, []);

  useEffect(() => {
    const dbRef = ref(getDatabase());
    const ordersRef = child(dbRef, "Orders");

    const handleDataChange = (snapshot) => {
      if (snapshot.exists()) {
        const orders = snapshot.val();
        setData(Object.values(orders));
      } else {
        console.log("No data available");
      }
    };

    onValue(ordersRef, handleDataChange);

    // Hủy lắng nghe khi component bị hủy
    return () => {
      off(ordersRef, handleDataChange);
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const signedInUser = userCredential.user;
        setUser(signedInUser);
        // ...
      })
      .catch((error) => {
        // Handle login error
        setLoading(false);
      });

    // Reset form fields
    setEmail("");
    setPassword("");
  };

  const Shipper = (item) => {
    const dbRef = ref(getDatabase());
    const ordersRef = child(dbRef, "Shipper");
    const newOrderRef = push(ordersRef);
    const newOrderKey = newOrderRef.key;

    const newOrderData = {
      ResAddress: "Shop Anh Linh",
      address: item.address,
      phone: item.phone,
      price: item.totalPrice,
      Node: item.note,
      money: item.thanhtoan,
      time: item.time,
    };

    const updatedCalledOrders = [...calledOrders, item]; // Tạo một biến mới để lưu giá trị cập nhật
    setCalledOrders(updatedCalledOrders); // Cập nhật giá trị mới

    console.log(updatedCalledOrders);
    console.log("New order added with key:", newOrderKey);

    set(newOrderRef, newOrderData)
      .then(() => {
        console.log("Data successfully saved.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const Remove = (item) => {
    const dbRef = ref(getDatabase());
    const postRef = child(dbRef, `Orders/${item.id}`);

    remove(postRef)
      .then(() => {
        console.log("Post successfully removed.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return user ? (
    <div className="App">
      <div className="head">
        <div className="head1">
          <div>
            <h1>Shop Anh Linh</h1>
          </div>
          <div className="X">
            <h2>Số Dư: 30000 KW</h2>
          </div>
          <div className="styles3">
            <p className="p">Tổng: {data.length}</p>
            <p className="p">Đã Gọi: {calledOrders.length}</p>
          </div>
        </div>
      </div>
      <div className="A">
  {data.map((item, index) => {
    if (data.map((item) => item.shopName).includes(item.shopName)) {
      return (
        <div className={`item ${calledOrders.includes(item) ? "called" : ""}`} key={index}>
          <div>
            <h4 className="text1">ResAddress : Shop Anh Linh</h4>
            <h4 className="text">ResPhone : 01025000935</h4>
            <h4 className="text">Address : {item.addressId}</h4>
            <h4 className="text">Phone : {item.phone}</h4>
            <h4 className="text">Sum : {item.totalPrice}</h4>
            <h4 className="text">Thanh Toán : {item.thanhtoan}</h4>
            <h4 className="text">
              Time : {moment(item.time).format("DD/MM/YYYY HH:mm")}
            </h4>

            <table>
              <thead>
                <tr className="tr">
                  <th className="td">Tên</th>
                  <th className="td">Giá</th>
                  <th className="td">Số Lượng</th>
                </tr>
              </thead>
              <tbody>
                {item.sanpham &&
                  item.sanpham.map((product, i) => (
                    <tr className="tr1" key={i}>
                      <td className="td">{product.name}</td>
                      <td className="td">{product.gia}</td>
                      <td className="td">{product.sl}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="btn">
            <button
              onClick={() => Remove(item)}
              className={`buttonStyle ${
                calledOrders.includes(item) ? "called" : ""
              }`}
            >
              XOÁ
            </button>
            <button
              className={`buttonStyle1 ${
                calledOrders.includes(item) ? "called" : ""
              }`}
            >
              SỬA
            </button>
          </div>

          <div>
            <button
              onClick={() => Shipper(item)}
              className={`buttonStyle2 ${
                calledOrders.includes(item) ? "called" : ""
              }`}
            >
              GỌI ĐƠN
            </button>
          </div>
        </div>
      );
    }
    return null;
  })}
</div>


    </div>
  ) : (
    loading ? <Loading /> :
    <form onSubmit={handleSubmit} className="login-form">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}
