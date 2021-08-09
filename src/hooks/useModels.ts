import { useContext } from "react";
import { ModelsContext } from "../contexts/ModelsContext";

export default function useModels() {
  const { models, setModels } = useContext(ModelsContext);
  return { models: models!, setModels: setModels! };
}