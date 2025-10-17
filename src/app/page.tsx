"use client";

import { useState } from "react";

export default function Home() {
  const [loginSwitch, setLoginSwitch] = useState(false);
  return (
    <div>
      <div className="border-2 p-2 font-bold">
        <h1 className="text-red-500 justify-center flex">TRAINING MACHINE</h1>
      </div>
      {loginSwitch ? (
        <div
          id="log-in"
          className="border-2 p-3 flex justify-center m-10 flex-col">
          <div>login: xxx</div>
          <div>password: xxx</div>

          <button onClick={() => setLoginSwitch(false)}>log in</button>
        </div>
      ) : (
        <div
          id="sign-up"
          className="border-2 p-3 flex justify-center m-10 flex-col">
          <div>name: xxx</div>
          <div>email: xxx</div>
          <div>login: xxx</div>
          <div>password: xxx</div>

          <button onClick={() => setLoginSwitch(true)}>sign up</button>
        </div>
      )}

      <div className="border-2 p-3 flex justify-center mx-10 flex-col">
        <div>blog/feed</div>
      </div>
    </div>
  );
}
