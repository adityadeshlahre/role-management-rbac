import { Button } from "@repo/ui/button";
import React from "react";

const Landing: React.FC = () => {
  return (
    <>
      <div className="text-8xl">Quick + Start</div>
      <Button
        appName="APP BUTTON CLICKED"
        className="text-6xl bg-lime-200 m-2 border-2 rounded-2xl border-lime-500 hover:bg-lime-300 hover:border-lime-600"
      >
        CLICK
      </Button>
    </>
  );
};

export default Landing;
