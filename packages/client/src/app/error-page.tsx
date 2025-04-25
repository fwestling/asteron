import React, { useMemo } from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  const message = useMemo<string>(() => {
    if ((error as any).statusText) {
      return (error as any).statusText;
    }
    else if (error instanceof Error) {
      return error.message;
    }
    return "An unexpected error has occurred.";
  },[error]);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{message}</i>
      </p>
    </div>
  );
}


export default ErrorPage;