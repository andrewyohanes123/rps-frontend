import { useContext, useMemo } from "react";
import { ModelsContext } from "../contexts/ModelsContext";

export default function useModels() {
  const { models, setModels } = useContext(ModelsContext);
  return useMemo(() => ({ models: models!, setModels: setModels! }), [models, setModels]);
}