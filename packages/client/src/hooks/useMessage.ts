import { useCallback } from "react"

const useMessage = () => {
  const alert = useCallback((message: string) => window.alert(message), []);
  const error = useCallback((message: string) => window.alert(`Error: ${message}`), []);


  return {alert, error};
}

export default useMessage;