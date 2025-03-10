import { LoadingType } from "consts/loading.const";
import React from "react";

interface LoadingProps {
  type?: LoadingType;
}

const Loading: React.FC<LoadingProps> = ({ type = LoadingType.PAGE }) => {
  return type === LoadingType.PAGE ? (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loading;
