// import React, { Component } from "react";

// class LoginPage extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       log: null,
//       lat: null,
//       dog: true,
//     };
//   }

//   componentDidMount() {
//     console.log("in component did mount");
//     this.setState({ dog: false });
//     navigator.geolocation.getCurrentPosition(async (position) => {
//       console.log("Latitude is :", position.coords.latitude);
//       console.log("Longitude is :", position.coords.longitude);
//       await this.setState({
//         lat: position.coords.latitude,
//         log: position.coords.longitude,
//       });
//     });
//   }

//   render() {
//     return (
//       <div>
//         <h4>Using geolocation JavaScript API in React</h4>
//       </div>
//     );
//   }
// }

// export default LoginPage;
import React, { useState, useEffect } from "react";

function LoginPage() {
  const [log, setLog] = useState(null);
  const [lat, setLat] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      await setLat(position.coords.latitude);
      await setLog(position.coords.longitude);
    });
  });

  console.log(lat, log, "------------");

  return (
    <div className="loginpage">
      <div>
        <h4>Using geolocation</h4>
        <p>Longitude:{log}</p>
        <p>Latitude:{lat}</p>
      </div>
    </div>
  );
}

export default LoginPage;
