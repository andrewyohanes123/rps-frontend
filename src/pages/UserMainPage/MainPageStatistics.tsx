import { FC, ReactElement, useEffect, useState, useCallback, useMemo } from "react"
import { ICollectionOptions } from "@edgarjeremy/sirius.adapter/dist/libs/ModelFactory"
import useModels from "hooks/useModels"
import { Skeleton, Statistic } from "antd";

interface props {
  model: string;
  modelOption: ICollectionOptions,
  title: string;
}

const MainPageStatistics: FC<props> = ({ model, modelOption, title }): ReactElement => {
  const modelName = useMemo<string>(() => model, [model]);
  const queryOption = useMemo<ICollectionOptions>(() => modelOption, [modelOption]);
  const statTitle = useMemo<string>(() => title, [title]);
  const { models } = useModels();
  const [amount, setAmount] = useState<number>(0);
  const [loading, toggleLoading] = useState<boolean>(true);
  const [retry, setRetry] = useState<number>(0);

  const getStats = useCallback(() => {
    toggleLoading(true);
    models[modelName].collection(queryOption).then(resp => {
      setAmount(resp.count);
      toggleLoading(false);
    }).catch(e => {
      console.log(e);
      setRetry(retry => retry + 1);
    });
  }, [modelName, queryOption, models]);

  useEffect(() => {
    retry < 4 && getStats();
  }, [getStats, retry]);

  return (
    loading ?
    <Skeleton.Button active />
    :
    <Statistic title={statTitle} value={amount} />
  )
}

export default MainPageStatistics
